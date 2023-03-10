import React from "react";

function DeleteTaskItem({ taskItem, HandleDeleteForever }) {
    return (
        <>
            {Boolean(taskItem.isDeleted) &&
                <button onClick={() => HandleDeleteForever(taskItem.id)}>XXX</button>}
        </>)
}

export default DeleteTaskItem;