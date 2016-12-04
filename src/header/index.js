import React from 'react';
import * as R from 'ramda';

export default (props) =>
{
    const preventDefault = event =>
        {
            event.preventDefault();
            return {...event, ...{}};
        };
    const extractData = R.compose(R.prop('value'), R.head, R.prop('target'));

    return <form onSubmit={R.compose(props.addTodo, extractData, preventDefault)}>
        <h1>todos</h1>
        <input className="new-todo" type="text"/>
    </form>
}
