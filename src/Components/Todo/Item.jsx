import React, {forwardRef, useContext} from 'react';
import {CardContent, Paper} from "@mui/material";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {AppDataContext} from "../Context/DataContext";
import TaskList from "../Task/TaskList";


export const Item = forwardRef(({id, ...props}, ref) => {
    const data = useContext(AppDataContext)
    const taskList = data.taskList.filter(task => task.todo_id === id.id)

    return (
        <div {...props} ref={ref}>
            <Paper elevation={10} style={{marginBottom: '20px'}}>
                <CardContent>
                    <Typography variant="h4">
                        {id.name}
                        {((data.currentUser.role === "admin" && false) || id.author === data.currentUser.id) &&
                            <>
                                <TextField sx={{mt: 1, mb: 1}} size="small" label="Добавить заметку"/>
                                <Button sx={{mt: 1, mb: 1}} variant="contained"> + </Button>
                            </>
                        }



                    </Typography>

                </CardContent>
            </Paper>
        </div>
    )
});