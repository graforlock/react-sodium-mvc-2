import React from 'react';
import * as R from 'ramda';

export class Model {
    text;
    sRemoveSink;
    sCompleteSink;
    completed;
    createdAt;
    completedAt;

    constructor(text,
                sRemoveSink,
                sCompleteSink,
                completed = false,
                createdAt = new Date(),
                completedAt = null)
    {
        this.sRemoveSink = sRemoveSink;
        this.sCompleteSink = sCompleteSink;
        this.text = text;
        this.completed = completed;
        this.createdAt = createdAt;
        this.completedAt = completedAt;
    }

    removeTodo = R.curry((index, event) =>
    {
        this.sRemoveSink.send(index);
    });

    toggleComplete = R.curry((index, event) =>
    {
        this.sCompleteSink.send(index);
    });
}

export const View = (model) =>
{
    return model.map(({toggleComplete, removeTodo, text, completedAt = ""}, index) =>
        <div key={index} >
            <span onClick={toggleComplete(index)}>complete todo</span>
            <span onClick={removeTodo(index)}>remove todo</span>
            <p >{text}</p>
            <p>{completedAt ? completedAt.toString() : ""}</p>
        </div>)
};

