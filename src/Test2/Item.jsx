import React, {forwardRef} from 'react';

const Item = forwardRef(({item, ...props}, ref) => {
    return (
        <div {...props} ref={ref}>{item.id + ": " + item.position}</div>
    )
});

export default Item