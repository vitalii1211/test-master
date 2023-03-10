import React, {useState} from "react";
import AddTaskItem from "./AddTaskItem";
import FilterButtons from "./FilterButtons";
import TaskList from "./TaskList";
import AuthService from "../../Services/auth.service";


function TaskContainer({ todoItem, editMode, searchItem, filterState, setFilterState }) {

    const currentUser = AuthService.getCurrentUser();

    return (
        <div>
            {((currentUser.result[0].role === "admin" && editMode) || todoItem.author === currentUser.result[0].id) &&
                <AddTaskItem
                    setFilterState={setFilterState}
                    todoItem={todoItem}
                />
            }

            <TaskList
                filterState={filterState}
                todoItem={todoItem}
                editMode={editMode}
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