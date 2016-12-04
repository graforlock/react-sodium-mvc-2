import React, {Component} from 'react';
import {StreamSink, Transaction, CellLoop} from 'sodiumjs';

import * as Todo from '../todo/index';
import Header from '../header';
import Archive from '../archive';

export class Model {
    sTodoList;

    constructor(todoList, sink$)
    {
        Transaction.run(() =>
        {
            this.sTodoList = new CellLoop();
            const sRemoveSink = new StreamSink(),
                  sCompleteSink = new StreamSink();

            const sAdd = sink$.map(text => new Todo.Model(text, sRemoveSink, sCompleteSink))
                .snapshot(this.sTodoList, Update.addTodo);

            const sRemove = sRemoveSink.snapshot(this.sTodoList, Update.removeTodo),
                  sComplete = sCompleteSink.snapshot(this.sTodoList, Update.completeTodo);

            const sDelta = sAdd
                .orElse(sRemove)
                .orElse(sComplete);

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
}

export const View = ({sAddTodo, model}) =>
{
    return (
        <section className="main">
            <Header addTodo={sAddTodo}/>
            <ul className="todo-list">{ Todo.View(model) }</ul>
            <Archive model={model} />
        </section>
    );
};