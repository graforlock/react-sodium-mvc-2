import React from 'react';
import ReactDOM from 'react-dom';
import {StreamSink, Unit} from 'sodiumjs';

import {Model, View} from './todo-list/index';

class TodoApp {
    static main(model, id = '.todoapp')
    {
        const sAddSink = new StreamSink(),
            sClearTodosSink = new StreamSink(),
            sToggleTodosSink = new StreamSink();

        const TodoModel = new Model(model,
                sAddSink, sClearTodosSink, sToggleTodosSink);

        const sAddTodo = (value) => sAddSink.send(value),
            sClearTodos = () => sClearTodosSink.send(Unit),
            sToggleTodos = () => sToggleTodosSink.send(Unit);

        TodoModel.sTodoList.listen(model =>
        {
            ReactDOM.render(
                <View sAddTodo={sAddTodo}
                      sClearTodos={sClearTodos}
                      sToggleTodos={sToggleTodos}
                      model={model}/>,
                document.querySelector(id)
            );
        });
    }
}

TodoApp.main([]);
