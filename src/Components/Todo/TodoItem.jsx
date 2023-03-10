import React, {useContext, useState} from "react";
import TodoItemTitle from "./TodoItemTitle";
import TaskContainer from "../Task/TaskContainer";
import {CardContent, Paper} from "@mui/material";
import api from "../../Services/api";
import {AppDataContext} from "../Context/DataContext";
import {CSS} from '@dnd-kit/utilities';
import {useSortable} from "@dnd-kit/sortable";


export function TodoItem({ todoItem, searchItem }) {
    const [filterState, setFilterState] = useState(todoItem.filter)

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id: todoItem.id,
    });

    const style = {
        // если не закоментить - прагают item при начале перетаскивания между контейнерами
        // transform: CSS.Transform.toString(transform),
        transition,
        display: 'flex'
    };

    const data = useContext(AppDataContext)
    const [editState, setEditState] = useState(false)
    const [inputValue, setInputValue] = useState(todoItem.name)


    const OnClickChangeEditState = () => {
        if (data.editMode)
            setEditState(!editState)
    }

    const OnClickCancelEdit = () => {
        setEditState(!editState)
        setInputValue(todoItem.name)
    }

    const OnClickSaveUpdatedTitle = async (id) => {
        const updatedTodoList = data.todoList.map(todoItem => todoItem.id === id
            ? {...todoItem, name: inputValue}
            : todoItem
        )
        data.setTodoList(updatedTodoList)
        setEditState(!editState)
        const updatedTodoItem = updatedTodoList.filter(todoItem => todoItem.id === id)
        if (updatedTodoItem.length) { // когда сохранили без изменений, объекта нет, нечего отправлять в БД
            try {
                await api.put("http://localhost:8800/todo/" + id, {name: updatedTodoItem[0].name})
            } catch (err) {
                console.log(err)
            }
        }
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Paper elevation={10} style={{marginBottom: '20px'}}>
                <CardContent>
                    <TodoItemTitle
                        OnClickChangeEditState={OnClickChangeEditState}
                        OnClickSaveUpdatedTitle={OnClickSaveUpdatedTitle}
                        todoItem={todoItem}
                        editState={editState}
                        title={todoItem.title}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        OnClickCancelEdit={OnClickCancelEdit}
                    />
                    <TaskContainer
                        todoItem={todoItem}
                        searchItem={searchItem}
                        filterState={filterState}
                        setFilterState={setFilterState}
                    />
                </CardContent>
            </Paper>
        </div>
    )
}