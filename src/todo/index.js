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
        this.completedAt = this.completedAt ? null : new Date();
        this.sCompleteSink.send({index, completedAt: this.completedAt});
    });
}

export const View = (model) =>
{
    return model.map(({toggleComplete, removeTodo, text, completedAt}, index) =>
        <li key={index} className={completedAt ? 'completed' : ''}>
            <div className="view">
                <input className="toggle" type="checkbox" onClick={toggleComplete(index)}/>
                <button className="destroy" onClick={removeTodo(index)}></button>
                <label >{text}</label>
            </div>
        </li>)
};

