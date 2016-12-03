import React, {Component} from 'react';
import { StreamSink, Transaction, CellLoop } from 'sodiumjs';

import * as Todo from '../todo/index';
import Header from '../header';

export class Model
{
    sTodoList;

    constructor(todoList, sink$)
    {
        Transaction.run(() =>
        {
            this.sTodoList = new CellLoop();

            const sAdd = sink$.map(text => new Todo.Model(text, new StreamSink())),
                  sDelta = sAdd.snapshot(this.sTodoList, Update.addTodo);

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
}

/* should be stateless, .renderTodos doesnt belong here */
export const View = ({sAddTodo, model}) =>
{
    return (
        <section>
            <Header addTodo={sAddTodo}/>
            { Todo.View(model) }
        </section>
    );
};


// Driver should ascertain whether its composable or mountable.