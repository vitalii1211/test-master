import React, {useContext, useState} from 'react';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import api from "../../Services/api";
import {AppDataContext} from "../Context/DataContext";

function AddTodoItem() {
    const data = useContext(AppDataContext)

    const [newInputItem, setNewInputItem] = useState("")

    const OnAddTodoItem = async () => {
        let newTodoItem = {
            id: null,
            name: newInputItem,
            author: data.currentUser.id,
            filter: "All"
        }
        try {
            await api.post("http://localhost:8800/todo", newTodoItem)
                .then(function (response) {
                    newTodoItem.id = response.data
                    data.setTodoList([...data.todoList, newTodoItem])
                })
        } catch (err) {
            console.log(err)
        }
        setNewInputItem("")
    }

    return (
        <>
            <TextField
                sx={{ mt: 3, mr: 2 }}
                size="small"
                label="Добавить новый лист"
                value={newInputItem}
                onChange={(e) => setNewInputItem(e.target.value)}
            />

            <Button sx={{ mr: 2 }} variant="contained" size="small" onClick={OnAddTodoItem}>Добавить</Button>
        </>);
}

export default AddTodoItem;