import React from "react";
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useDroppable,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {
    SortableContext, sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import {SortableItem} from "./SortableItem";

function Container({id, items}) {

    const { isOver, setNodeRef } = useDroppable({
        id: 'droppable'
    })

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    return (

        <div ref={setNodeRef} style={{
            height: '100%',
            backgroundColor: 'lightblue',
            margin: '10px',
            padding: '10px',
            borderRadius: '10px'
        }}>
            <SortableContext id={id} items={items} strategy={verticalListSortingStrategy}>
                Контейнер {id}
                <div style={{display: 'grid'}}>
                    {items
                        .filter(item => item.cont === id)
                        .map(item =>
                            <SortableItem key={item.id} item={item}/>
                        )
                    }
                </div>
            </SortableContext>
        </div>
)
    //
    //     <SortableContext
    //         id={id}
    //         items={items}
    //         strategy={verticalListSortingStrategy}
    //     >
    //         <div ref={setNodeRef} style={containerStyle}>
    //             {items.map((id) => (
    //                 <SortableItem key={id} id={id} />
    //             ))}
    //         </div>
    //     </SortableContext>
    // );
}

export default Container
