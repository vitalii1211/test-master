import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import api from "../../Services/api";
import {useContext} from "react";
import {AppDataContext} from "../Context/DataContext";

export default function UserListSortSelector(props) {
    const data = useContext(AppDataContext)

    async function changeHandler(value) {
        props.setSortType(value)
        try {
            await api.put("http://localhost:8800/updateUser/" + data.currentUser.id, {sort_type: value})
        } catch (err) {
            console.log(err)
        }
    }

    return (
            <FormControl sx={{m: 2}} size="small">
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                    Сортировать списки пользователей по
                </InputLabel>
                <NativeSelect
                    value={props.sortType}
                    onChange={(e) => changeHandler(e.target.value)}
                    inputProps={{
                        name: 'age',
                        id: 'uncontrolled-native',
                    }}
                >
                    <option value={10}>Фамилии</option>
                    <option value={20}>Фамилии, мои первыми</option>
                    <option value={30}>Порядку выбора</option>
                </NativeSelect>
            </FormControl>
    );
}