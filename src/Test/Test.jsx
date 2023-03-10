import React, {useState} from 'react';
import {DndContext} from '@dnd-kit/core';

import {Droppable} from './Droppable';
import {Draggable} from './Draggable';

function Test() {
    const containers = ['A', 'B', 'C'];
    const [parent, setParent] = useState(null);
    const draggableMarkup = (
        <Draggable id="draggable">Drag me</Draggable>
    );

    const arr = [
        {id: "1", cont: 1},
        {id: "2", cont: 1},
        {id: "3", cont: 1},
        {id: "4", cont: 1}
    ]

    const arr1 = arr.map(id => id.id)
    console.log(arr)
    console.log(arr1)

    return (
        <DndContext onDragEnd={handleDragEnd}>
            {parent === null ? draggableMarkup : null}

            {containers.map((id) => (
                // We updated the Droppable component so it would accept an `id`
                // prop and pass it to `useDroppable`
                <Droppable key={id} id={id}>
                    {parent === id ? draggableMarkup : 'Drop here'}
                </Droppable>
            ))}
        </DndContext>
    );

    function handleDragEnd(event) {
        const {over} = event;

        // If the item is dropped over a container, set it as the parent
        // otherwise reset the parent to `null`
        setParent(over ? over.id : null);
    }
};

export default Test