import React, {useState} from 'react';
import {
    closestCenter,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor, useDroppable,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import {SortableItem} from './SortableItem';
import Item from './Item';
import Container from "./Container";
import Droppable from "./Droppable";


function Test2(props) {
    const [activeId, setActiveId] = useState(null);
    const [activeCont, setActiveCont] = useState(null)

    const containers = [1, 2]

    const [items, setItems] = useState([
        {id: '1', position: 2, cont: 1},
        {id: '2', position: 1, cont: 1},
        {id: '3', position: 3, cont: 1},
        {id: '4', position: 4, cont: 1},
        {id: '5', position: 5, cont: 1},
        {id: '6', position: 1, cont: 2},
    ])

    const sortedItems = [...items].sort(
        (a, b) => {
            const nameA = a.position, nameB = b.position
            if (nameA < nameB) //сортируем строки по возрастанию
                return -1
            if (nameA > nameB)
                return 1
            return 0 // Никакой сортировки
        })

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragStart(event) {
        const {active} = event;
        console.log("active.id", active.id)
        const activeObject = items.find(item => item.id === active.id)
        console.log("activeObject", activeObject)
        setActiveId(activeObject);
    }

    function handleDragEnd(event) {
        const {active, over} = event;

        console.log(over.data.current)


        // if (over && over.data.current.accepts.includes(active.data.current.type)) {
        // }


        const activeContainer = active.data.current.sortable.containerId
        const overContainer = over.data.current.sortable.containerId
        const activeItem = items.find(item => item.id === active.id)
        const overItem = items.find(item => item.id === over.id)
        if (activeContainer === overContainer) {
            const updatedItems = items.map(item => {
                if (item.id === activeItem.id) {
                    return {...item, position: overItem.position}
                }
                if (item.id === overItem.id) {
                    return {...item, position: activeItem.position}
                }
                return item
            })
            setItems(updatedItems)
        }
        if (activeContainer !== overContainer) {
            const updatedItems = items.map(item => {
                if (item.id === activeItem.id) {
                    return {...item, position: overItem.position, cont: overItem.cont}
                }
                if (item.cont === overItem.cont) {
                    if (item.position < overItem.position) {
                        return item
                    }
                    if (item.position >= overItem.position) {
                        return {...item, position: item.position + 1}
                    }
                }
                if (item.cont === activeItem.cont) {
                    if (item.position < activeItem.position) {
                        return item
                    }
                    if (item.position >= overItem.position) {
                        return {...item, position: item.position - 1}
                    }
                }
                return item
            })

            setItems(updatedItems)
        }
        setActiveId(null);
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={(event) => handleDragStart(event)}
            onDragEnd={handleDragEnd}
        >
            <div style={{display: 'flex'}}>
                {containers.map(container =>
                    <Container
                        id={container}
                        items={sortedItems}
                        setItems={setItems}
                        activeCont={activeCont}
                        setActiveCont={setActiveCont}
                    />
                )}
            </div>
            <Droppable />
            <DragOverlay>
                {activeId ? <Item item={activeId}/> : null}
            </DragOverlay>
        </DndContext>
    );
}

export default Test2