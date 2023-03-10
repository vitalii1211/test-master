import {useDroppable} from "@dnd-kit/core";
import Grid from "@mui/material/Grid";

function Droppable(props) {
    const {setNodeRef} = useDroppable({
        id: props.id,
    });
    return (
        <Grid item xs={4}>
        <div ref={setNodeRef} style={{height: "100%", width: "100%"}}>
            {props.children}
        </div>
        </Grid>

    );
}

export default Droppable