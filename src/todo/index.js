import React from 'react';
import * as R from 'ramda';

export class Model {
    text;
    sink$;
    completed;
    createdAt;
    completedAt;

    constructor(text,
                sink$,
                completed,
                createdAt = new Date(),
                completedAt = new Date())
    {
        this.sink$ = sink$;
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

export const View = props => <div onClick={props.toggle}>
    {props.text}
</div>;

