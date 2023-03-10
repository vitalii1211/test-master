import React, {useContext, useState} from "react";
import AddTaskItem from "./AddTaskItem";
import FilterButtons from "./FilterButtons";
import TaskList from "./TaskList";
import AuthService from "../../Services/auth.service";
import {AppDataContext} from "../Context/DataContext";


function TaskContainer({ todoItem, searchItem, filterState, setFilterState }) {
    const data = useContext(AppDataContext)
    const currentUser = AuthService.getCurrentUser();

    return (
        <div>
            {((currentUser.result[0].role === "admin" && data.editMode) || todoItem.author === currentUser.result[0].id) &&
                <AddTaskItem
                    setFilterState={setFilterState}
                    todoItem={todoItem}
                />
            }

            <TaskList
                filterState={filterState}
                todoItem={todoItem}
                searchItem={searchItem}

            />

            <FilterButtons
                filterState={filterState}
                setFilterState={setFilterState}
                todoItem={todoItem}
            />
        </div>
    )
}

export default TaskContainer;