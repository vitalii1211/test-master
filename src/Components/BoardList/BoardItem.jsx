import React from 'react';
import TodoList from "../Todo/TodoList";

const BoardItem = ({user, todoListAfterSearch, editMode, searchItem, sortType, items, activeTodo }) => {

    return (
            <>
                <h1 align="center">
                    {user.first_name + " " + user.last_name}
                </h1>
                <div>
                    <TodoList
                        todoListAfterSearch={todoListAfterSearch}
                        user={user}
                        editMode={editMode}
                        searchItem={searchItem}
                        sortType={sortType}
                        items={items}
                        activeTodo={activeTodo}
                    />
                </div>
            </>
    )
};

export default BoardItem;