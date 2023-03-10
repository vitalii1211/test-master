import React, {useContext} from 'react';
import TaskItem from "./TaskItem";
import {AppDataContext} from "../Context/DataContext";


function TaskList({ filterState, todoItem, editMode, searchItem }) {
    const data = useContext(AppDataContext)

     const filteredItems = data.taskList
         .filter((el) => {
        if (filterState === "All") {
            return data.taskList && !el.isDeleted
        } else if (filterState === "Active") {
            return !el.isDone && !el.isDeleted
        } else if (filterState === "Completed") {
            return el.isDone && !el.isDeleted
        } else if (filterState === "Deleted") {
            return el.isDeleted
        } else return data.taskList && !el.isDeleted
    })

   const taskListOfTodo = [...filteredItems]
        .filter(item => item.title.toLowerCase().includes(searchItem.toLowerCase()))
        .filter(el => el.todo_id === todoItem.id)
        .reverse()

    return (
        <div>
            {taskListOfTodo.length
                ?
                taskListOfTodo
                    .map(taskItem =>
                        <TaskItem
                            key={taskItem.id}
                            taskItem={taskItem}
                            editMode={editMode}
                        />
                    )
                : "Здесь пусто"
            }

        </div>
    );
}

export default TaskList;