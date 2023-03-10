import React, {useContext, useState} from "react";
import DeleteTaskItem from "./DeleteTaskItem";
import TaskItemTitle from "./TaskItemTitle";
import api from "../../Services/api";
import {AppDataContext} from "../Context/DataContext";


function TaskItem({taskItem, editMode}) {
    const data = useContext(AppDataContext)

    const [editState, setEditState] = useState(false)
    const [inputValue, setInputValue] = useState(taskItem.title)

    const HandleUpdateItem = async (id, value) => {
        const updatedTaskList = data.taskList.map(taskItem =>
            taskItem.id === id
                ? value === "isDone"
                    ? {...taskItem, isDone: !taskItem.isDone}
                    : value === "title"
                        ? {...taskItem, title: inputValue}
                        : value === "isDeleted"
                            ? {...taskItem, isDeleted: !taskItem.isDeleted}
                            : taskItem : taskItem)
        data.setTaskList(updatedTaskList);
        if (value === "title") {
            setEditState(!editState)
        }
        try {
            const updatedTaskItem = updatedTaskList.find(taskItem => taskItem.id === id)
            await api.put("http://localhost:8800/task/" + id, updatedTaskItem)
        } catch (err) {
            console.log(err)
        }
    }

    const HandleDeleteForever = async (id) => {
        const updatedTaskList = data.taskList.filter((i) => i.id !== id)
        data.setTaskList(updatedTaskList)
        try {
            await api.delete("http://localhost:8800/task/" + id)
        } catch (err) {
            console.log(err)
        }
    }




    return (
        <div>
            <table>
                <tbody>
                <tr>
                    <td>
                        <input type="checkbox"
                               width="fullWidth"
                               disabled={taskItem.isDeleted}
                               onChange={() => HandleUpdateItem(taskItem.id, "isDone")}
                               checked={taskItem.isDone}
                        />
                    </td>
                    <td>
                        <TaskItemTitle
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                            taskItem={taskItem}
                            editState={editState}
                            setEditState={setEditState}
                            editMode={editMode}
                            HandleUpdateItem={HandleUpdateItem}
                        />
                    </td>
                    <td><>
                        {!taskItem.isDeleted
                            ? !editState && editMode &&
                            <button onClick={() => HandleUpdateItem(taskItem.id, "isDeleted")}>X</button>
                            : <button onClick={() => HandleUpdateItem(taskItem.id, "isDeleted")}>---</button>
                        }

                        <DeleteTaskItem
                            taskItem={taskItem}
                            HandleDeleteForever={HandleDeleteForever}
                        />
                    </>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    )
}

export default TaskItem;