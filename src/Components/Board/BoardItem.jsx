import React from 'react';
import TodoList from "../Todo/TodoList";

const BoardItem = ({user, todoListAfterSearch, searchItem, items, activeTodo }) => {

    return (
            <>
                <h1 align="center">
                    {user.first_name + " " + user.last_name}
                </h1>
                <div>
                    <TodoList
                        todoListAfterSearch={todoListAfterSearch}
                        user={user}
                        searchItem={searchItem}
                        items={items}
                        activeTodo={activeTodo}
                    />
                </div>
            </>
    )
};

export default BoardItem;