import React, {useContext} from "react";
import {ButtonGroup} from "@mui/material";
import Button from "@mui/material/Button";
import api from "../../Services/api";
import {AppDataContext} from "../Context/DataContext";


function FilterButtons({filterState, setFilterState, todoItem}) {
    const data = useContext(AppDataContext)

    async function onFilterValueChanged(event, id) {
        try {
            await api.put("http://localhost:8800/todo/" + id, {
                name: todoItem.name, filter: event.target.value
            })
        } catch (err) {
            console.log(err)
        }
        setFilterState(event.target.value)
        console.log("data.todoList", data.todoList)
        console.log("id", id)

        const updatedTodoList = data.todoList.map(todo => {
            if (todo.id === id) {
                return {...todo, filter: event.target.value}
            }
            return todo
        })
        console.log("updatedTodoList", updatedTodoList)
        data.setTodoList(updatedTodoList)
    }

    const buttons = [
        <Button
            variant={filterState === "All" ? "contained" : "outlined"}
            key="All" value="All" onClick={(event) => onFilterValueChanged(event, todoItem.id)}>
            All
        </Button>,
        <Button
            variant={filterState === "Active" ? "contained" : "outlined"}
            key="Active" value="Active" onClick={(event) => onFilterValueChanged(event, todoItem.id)}>
            Active
        </Button>,
        <Button
            variant={filterState === "Completed" ? "contained" : "outlined"}
            key="Completed" value="Completed" onClick={(event) => onFilterValueChanged(event, todoItem.id)}>
            Completed
        </Button>,
        <Button
            variant={filterState === "Deleted" ? "contained" : "outlined"}
            key="Deleted" value="Deleted"
            onClick={(event) => onFilterValueChanged(event, todoItem.id)}>
            [Корзина]
        </Button>
    ]
    return (
        <div>
            <ButtonGroup sx={{mt: 2}} size="small" aria-label="small button group">{buttons}</ButtonGroup>
        </div>
    )
}

export default FilterButtons;