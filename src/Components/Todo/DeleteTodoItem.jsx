import React, {useContext} from 'react';
import api from "../../Services/api";
import {AppDataContext} from "../Context/DataContext";

function DeleteTodoItem({todoItem}) {
    const data = useContext(AppDataContext)

    const OnDeleteTodoItem = async (id) => {
        const taskListOfTodo = data.taskList.filter(el => el.todo_id === todoItem.id)
        if (taskListOfTodo.length > 0) {
            alert("Нельзя удалить, т.к. есть задачи")
        } else {
            const updatedTodoList = data.todoList.filter((todoItem) => todoItem.id !== id)
            data.setTodoList(updatedTodoList)
            try {
                await api.delete("http://localhost:8800/todo/" + id)
            } catch (err) {
                console.log(err)
            }
        }
    }

    return (
        <button
            onClick={(e) => OnDeleteTodoItem(todoItem.id)}>X</button>
    );
}

export default DeleteTodoItem;