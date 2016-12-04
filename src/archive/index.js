import React from 'react';
import Maybe from '../lib/maybe';
import * as R from 'ramda';

export default ({model, clearTodos}) => {
    const predicate = R.compose(
        model => model.length ? model : null,
        model => model.filter(todo => todo.completedAt));

    const safeRender = Maybe.fromNullable(predicate(model))
        .map(completed => completed.map(todo => <p key={Math.random()}>{todo.text}</p>))
        .orElse(() => <p>0 completed.</p>)
        .flatMap(R.identity);

    return <section className="footer" onClick={clearTodos}>{ safeRender }</section>;

};
