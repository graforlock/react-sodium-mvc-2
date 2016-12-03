import React, { Component } from 'react';
import { StreamSink, Transaction, CellLoop, Cell } from 'sodiumjs';

import Todo from './model/todo';
import Item from './item';

export default class App extends Component {
    constructor(props)
    {
        super(props);
        this.state = { todoList: [] };
        this.sink$ = new StreamSink();
    }

    componentWillMount()
    {
        Transaction.run(() =>
        {
            const value = new CellLoop(),
                  render = new StreamSink();

            value.loop(render.hold(this.state.todoList));

            this.sink$.listen(v => v);
        });
    }

    renderTodos()
    {
        return this.state.todoList.map((model, index) => <Item key={index} index={index}
                                                               addTodo={model.addTodo} />);
    }

    render() {
        return <section>{ this.renderTodos() }</section>;
    }
}
