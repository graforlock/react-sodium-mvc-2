import React, {Component} from 'react';
import {StreamSink, Transaction, CellLoop} from 'sodiumjs';
import * as R from 'ramda';

import {Left, Right} from '../lib/either';

import * as Todo from '../todo/index';
import Header from '../header';
import Archive from '../archive';

export class Model {
    sTodoList;

    constructor(todoList, sAddSink, sClearTodosSink, sToggleTodosSink)
    {
        Transaction.run(() =>
        {
            this.sTodoList = new CellLoop();
            const sRemoveSink = new StreamSink(),
                  sCompleteSink = new StreamSink();

            const sAdd = sAddSink
                .filter(text => text !== "")
                .map(text => new Todo.Model(text, sRemoveSink, sCompleteSink))
                .snapshot(this.sTodoList, Update.addTodo);

            const sRemove = sRemoveSink.snapshot(this.sTodoList, Update.removeTodo),
                  sComplete = sCompleteSink.snapshot(this.sTodoList, Update.completeTodo);

            const sToggleTodos = sToggleTodosSink.snapshot(this.sTodoList, Update.toggleTodos),
                  sClearTodos = sClearTodosSink.snapshot(this.sTodoList, Update.clearTodos);

            const sDelta = sAdd
                .orElse(sRemove)
                .orElse(sComplete)
                .orElse(sToggleTodos)
                .orElse(sClearTodos);

            this.sTodoList.loop(sDelta.hold(todoList));
        });
    }
}

class Update
{
    static addTodo = (todo, acc) => R.append(todo, acc);

    static removeTodo = (index, acc) => R.remove(index, 1, acc);

    static completeTodo({index, completedAt}, acc)
    {
        return R.over(R.lensIndex(index), R.assoc('completedAt', completedAt), acc);
    }

    static clearTodos = (UNIT, acc) => acc.filter(todo => !todo.completedAt);

    static toggleTodos(UNIT, acc)
    {
        let accumulator = acc.filter(todo => todo.completedAt).length === acc.length
            ? Left.of(acc)
            : Right.of(acc);

        return accumulator
            .map(todos => todos.map(todo => todo.completeTodo()))
            .orElse(todos => Right.of(todos.map(todo => todo.incompleteTodo())))
            .__value;
    }
}

export const View = ({sAddTodo, sClearTodos, sToggleTodos, model}) =>
{
    return (
        <section >
            <Header addTodo={sAddTodo}/>
            <section className="main">
                <input onClick={sToggleTodos} className="toggle-all" type="checkbox"/>
                <ul className="todo-list">{ Todo.View(model) }</ul>
            </section>
            <Archive model={model} clearTodos={sClearTodos}/>
        </section>
    );
};