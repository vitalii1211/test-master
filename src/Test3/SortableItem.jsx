import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

export function SortableItem(props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id: props.id.id,
        position: props.id.position,
        container: props.id.container
    });

    const style = {
        // transform: CSS.Transform.toString(transform),
        // если не закоментить - прагают item при начале перетаскивания между контейнерами
        transition,
        display: 'flex'
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <button style={{width: "100%"}}>
                {props.id.position + " : " + props.id.name}
            </button>
        </div>
    );
}

export default SortableItem