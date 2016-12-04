import React, {Component} from 'react';
import {StreamSink, Transaction, CellLoop} from 'sodiumjs';

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
    static addTodo(todo, acc)
    {
        acc.push(todo);
        return acc;
    }

    static removeTodo(index, acc)
    {
        acc.splice(index, 1);
        return acc;
    }

    static completeTodo({index, completedAt}, acc)
    {
        acc[index].completedAt = completedAt;
        return acc;
    }

    static clearTodos(UNIT, acc)
    {
        return acc.filter(todo => !todo.completedAt);
    }

    static toggleTodos(UNIT, acc)
    {
        let allChecked = acc.filter(todo => todo.completedAt).length === acc.length;

        return acc.map(todo => {
            if(!allChecked && todo.completedAt) return todo;
            todo.completedAt = allChecked ? null : new Date();
            return todo;
        });
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