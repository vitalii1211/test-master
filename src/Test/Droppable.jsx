import React from 'react';
import {useDroppable} from '@dnd-kit/core';

export function Droppable(props) {
    const {isOver, setNodeRef: setFirstDroppableRef} = useDroppable({
        id: props.id,
    });

    // const {setNodeRef: setsecondDroppableRef} = useDroppable({
    //     id: props.id,
    // });


    const style = {
        color: isOver ? 'green' : undefined,
    };


    return (

        <section>
            <div ref={setFirstDroppableRef} style={style}>
                {props.children}
            </div>
            {/*<div ref={setsecondDroppableRef} style={style}>*/}
            {/*    {props.children}*/}
            {/*</div>*/}
        </section>
    );
}