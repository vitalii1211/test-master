import React, {useContext} from 'react';
import {AppDataContext} from "../Context/DataContext";

function TaskItemTitle({ inputValue, setInputValue, taskItem, editState, setEditState, HandleUpdateItem }) {
    const data = useContext(AppDataContext)


    const OnClickChangeEditState = () => {
        if (data.editMode)
            setEditState(true)
    }

    const OnClickCancelEdit = () => {
        setEditState(!editState)
        setInputValue(taskItem.title)
    }

    return (
        <div
            draggable
            onDoubleClick={OnClickChangeEditState}
            style={(taskItem.isDone) ? {textDecoration: 'line-through'} : null}
        >
            {!editState
                ? taskItem.title
                : <input type="text"
                         autoFocus={true}
                         value={inputValue}
                         onChange={(e) => setInputValue(e.target.value)}
                         onBlur={() => HandleUpdateItem(taskItem.id, "title")}
                         onKeyDown={(e) => {
                             if (e.keyCode === 13) {
                                 HandleUpdateItem(taskItem.id, "title");
                             } else if (e.keyCode === 27) {
                                 OnClickCancelEdit()
                             }
                         }}
                />
            }
        </div>
    );
}

export default TaskItemTitle;