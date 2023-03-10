import React, {useContext} from 'react';
import DeleteTodoItem from "./DeleteTodoItem";
import Typography from "@mui/material/Typography";
import {AppDataContext} from "../Context/DataContext";


function TodoItemTitle(
    {
        OnClickChangeEditState,
        OnClickSaveUpdatedTitle,
        todoItem,
        editState,
        inputValue,
        setInputValue,
        OnClickCancelEdit
    }) {
    const data = useContext(AppDataContext)


    return (
        <>
            <Typography
                variant="h4"
                onDoubleClick={OnClickChangeEditState}
                onBlur={() => OnClickSaveUpdatedTitle(todoItem.id)}
            >
                {!editState ? (
                    <>
                        {todoItem.name}

                        {data.editMode && (
                            <DeleteTodoItem
                                todoItem={todoItem}
                            />
                        )}
                    </>
                ) : (
                    <>
                        <input
                            type="text"
                            autoFocus={true}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.keyCode === 13) {
                                    OnClickSaveUpdatedTitle(todoItem.id);
                                } else if (e.keyCode === 27) {
                                    OnClickCancelEdit();
                                }
                            }}
                        />
                    </>
                )}
            </Typography>
        </>
    );
}

export default TodoItemTitle;