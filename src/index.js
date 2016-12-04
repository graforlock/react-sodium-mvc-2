import React from 'react';
import ReactDOM from 'react-dom';
import { StreamSink } from 'sodiumjs';

import { Model, View } from './todo-list/index';

class TodoApp {
    static main(model, id = '.todoapp')
    {
        const todoListSink$ = new StreamSink(),
              TodoModel = new Model(model, todoListSink$),
              sAddTodo = (value) => todoListSink$.send(value);

        TodoModel.sTodoList.listen(model =>
        {
            ReactDOM.render(
                <View sAddTodo={sAddTodo}
                             model={model}/>,
                document.querySelector(id)
            );
        });
    }
}

TodoApp.main([]);
