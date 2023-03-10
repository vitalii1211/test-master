import React, {useContext, useState} from 'react';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import api from "../../Services/api";
import {AppDataContext} from "../Context/DataContext";

function AddTaskItem({ setFilterState, todoItem }) {
    const data = useContext(AppDataContext)

    const [newInputItem, setNewInputItem] = useState("")

    const HandleAddTaskItem = async () => {
        let newTaskItem = {
            id: null,
            todo_id: todoItem.id,
            title: newInputItem,
            isDone: false,
            dateTime: "2019-03-28 10:00:00",
            isDeleted: false
        }
        try {
            await api.post("http://localhost:8800/task", newTaskItem)
                .then(function (response) {
                    newTaskItem.id = response.data
                    setFilterState("All")
                    data.setTaskList([...data.taskList, newTaskItem])
                    setNewInputItem("")
                })
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div>
            <TextField
                sx={{ mt: 1, mb: 1}}
                size="small"
                label="Добавить заметку"
                value={newInputItem} onChange={(e) => setNewInputItem(e.target.value)}
                onKeyDown={(e) => {if (e.keyCode === 13) {HandleAddTaskItem()}}}
            />
            <Button sx={{ mt: 1, mb: 1}} variant="contained" onClick={HandleAddTaskItem}> + </Button>
        </div>
    );
}

export default AddTaskItem;