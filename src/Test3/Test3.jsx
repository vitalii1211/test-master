import {closestCorners, DndContext, pointerWithin, useDraggable, useDroppable} from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities";
import {
    closestCenter,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove, horizontalListSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {useState} from "react";
import SortableItem from "./SortableItem";

function Droppable(props) {
    const {setNodeRef} = useDroppable({
        id: props.id,
    });
    return (
        <div ref={setNodeRef} style={{height: "80vh", width: "200px", backgroundColor: "lightblue", margin: '30px'}}>
            {props.children}
        </div>
    );
}

function Test3() {
    const [activeId, setActiveId] = useState(null);
    const containers = ["zone1", "zone2", "zone3", "zone4"]
    const [items, setItems] = useState([
        {id: 1, name: 'Папа', position: 1, container: "zone1"},
        {id: 2, name: 'Мама', position: 2, container: "zone1"},
        {id: 3, name: 'Максим', position: 1, container: "zone2"},
        {id: 4, name: 'Савелий', position: 2, container: "zone2"},
        {id: 5, name: 'Полина', position: 1, container: "zone3"},
        {id: 6, name: 'Милана', position: 2, container: "zone3"},
        {id: 7, name: 'Бабушка', position: 1, container: "zone4"},
        {id: 8, name: 'Владик', position: 2, container: "zone4"},
        {id: 9, name: 'Торт', position: 3, container: "zone4"},
    ]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={pointerWithin}
            strategy={horizontalListSortingStrategy}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items}
            >
                <div style={{display: "flex"}}>
                    {containers.map(container =>
                        <Droppable id={container} key={container}>
                            {items
                                .filter(item => item.container === container)
                                .sort((a, b) => {
                                    const aa = a.position, bb = b.position
                                    if (aa > bb) return 1
                                    if (aa < bb) return -1
                                    return 0
                                })
                                .map(item =>
                                    <SortableItem key={item.id} id={item}/>
                                )}
                        </Droppable>
                    )}
                </div>
            </SortableContext>
            <DragOverlay>
                <SortableItem id={activeId}/>
            </DragOverlay>
        </DndContext>
    );

    function handleDragStart(event) {
        const {active} = event;
        const activeItem = items.find(item => item.id === active.id)
        setActiveId(activeItem);
    }

    function handleDragEnd(event) {
        const {active, over} = event;
        const activeItem = items.find(item => item.id === active.id)
        const overItem = items.find(item => item.id === over.id)
        const overContainer = containers.find(item => item === over.id)

        console.log("overItem", overItem)
        console.log("overContainer", overContainer)

        if (overContainer) {
            console.log("что делать если в контейнер. Может быть в другой, а может быть в этот же")
            if (activeItem.container === overContainer) {
                console.log("ДА")
                const overContainerItems = items.filter(item => item.container === over.id)
                const updatedItems = items.map(item => {
                    if ((item.container === overContainer) && (item.position > activeItem.position)) {
                        return {...item, position: item.position - 1}
                    }
                    if (item.id === active.id) {
                        console.log("item=", item)
                        return {...item, position: overContainerItems.length, container: overContainer}
                    }
                    return item
                })
                console.log("updatedItems", updatedItems)
                setItems(updatedItems)
            }
            if (activeItem.container !== overContainer) {
                const overItems = items.filter(item => item.container === over.id)
                const updatedItems = items.map(item => {
                    if (item.id === active.id) {
                        console.log("item", item)
                        return {...item, position: overItems.length + 1, container: overContainer}
                    }
                    if ((item.container === activeItem.container) && (item.position > activeItem.position)) {
                        return {...item, position: item.position - 1}
                    }
                    return item
                })
                setItems(updatedItems)
            }
        }

        if (overItem) {
            console.log("что делать если в item: в тот же контейнер или другой")
            if (activeItem.container === overItem.container) {
                console.log("Тот же контейнер")
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
            if (activeItem.container !== overItem.container) {
                console.log("Другой контейнер")
                const updatedItems = items.map(item => {
                    if (item.id === activeItem.id) {
                        return {...item, position: overItem.position, container: overItem.container}
                    }
                    if ((item.container === overItem.container) && (item.position >= overItem.position)) {
                        return {...item, position: item.position + 1}
                    }
                    if ((item.container === activeItem.container) && (item.position > activeItem.position)) {
                        return {...item, position: item.position - 1}
                    }

                    return item
                })
                setItems(updatedItems)
            }
        }

    }
}

export default Test3;
