import React, {useContext} from 'react';
import {TodoItem} from "./TodoItem";
import {AppDataContext} from "../Context/DataContext";
import api from "../../Services/api";
import {SortableContext} from "@dnd-kit/sortable";


function TodoList({ todoListAfterSearch, user, searchItem, setSearchItem, todo1, setTodo1 }) {
    const data = useContext(AppDataContext)

    const todoListOfUser = todoListAfterSearch
        .filter(todo => todo.author === user.id)
    const todolistFinal = [...todoListOfUser].sort((a, b) => {
        const numA = a.position, numB = b.position
        if (numA > numB) {
            return 1
        }
        if (numB > numA) {
            return -1
        }
    })


    return (
        <>
            {todolistFinal
                .map((todoItem) =>
                    <SortableContext items={todoListOfUser} key={todoItem.id}>
                        <TodoItem
                            todoItem={todoItem}
                            searchItem={searchItem}
                            setSearchItem={setSearchItem}
                            todoListFinal={todoListOfUser}
                            todo1={todo1}
                            setTodo1={setTodo1}
                            user={user}
                            todolistFinal={todolistFinal}
                        />
                    </SortableContext>
                )}
        </>);
}


export default TodoList;