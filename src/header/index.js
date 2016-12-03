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
        <input type="text"/>
    </form>
}
