import React from 'react';
import * as R from 'ramda';

export default class TodoModel {
    completed;
    createdAt;
    completedAt;

    constructor({completed, sink$, createdAt = new Date(), completedAt = new Date()})
    {
        this.completed = completed;
        this.createdAt = createdAt;
        this.completedAt = completedAt;
        this.sink$ = sink$;
    }

    toggleComplete = () =>
    {
        this.completed = !this.completed;
    };

    addTodo(data)
    {
         this.sink$.send(data);
    }
}