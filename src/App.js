import React, { Component } from 'react';
import { StreamSink, Transaction, CellLoop } from 'sodiumjs';
import * as R from 'ramda';

import * as Todo from './todo/index';
import Header from './header';


/* App Should be Model and View as well, decoupled
    so i dont have to fucking use the state shit */

export default class App extends Component {
    constructor(props)
    {
        super(props);
        this.state = { todoList: [ /* new Todo.Model(false, this.sink$) */ ] };

    }

    todoListSink$ = new StreamSink();

    addTodo = (value) => this.todoListSink$.send(value);

    componentWillMount()
    {
        Transaction.run(() =>
        {
            const todoSink$ = new StreamSink(),
                  value = new CellLoop(),
                  render = new StreamSink();

            value.loop(render.hold(this.state.todoList));

            this.todoListSink$.listen(v =>
            {
                const newTodos = this.state.todoList.concat(new Todo.Model(todoSink$, v));
                this.setState({todoList: newTodos});
            });
        });
    }

    renderTodos()
    {
        return this.state.todoList
            .map((model, index) => <Todo.View key={index} index={index}
                                                               toggle={model.toggleComplete} />);
    }

    render() {
        return <section>
            <Header addTodo={this.addTodo}/>
            { this.renderTodos() }
        </section>;
    }
}

// Driver should ascertain whether its composable or mountable.