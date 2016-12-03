import React from 'react';
import * as R from 'ramda';

export class Model {
    text;
    sSink;
    completed;
    createdAt;
    completedAt;

    constructor(text,
                sSink,
                completed = false,
                createdAt = new Date(),
                completedAt = null)
    {
        this.sSink = sSink;
        this.text = text;
        this.completed = completed;
        this.createdAt = createdAt;
        this.completedAt = completedAt;
    }

    toggleComplete = () =>
    {
        this.completed = !this.completed;
    };
}

export const View = (model) =>
{
    return model.map(({toggleComplete, text}, index) => <div key={index} onClick={toggleComplete}>{text}</div>)
};

