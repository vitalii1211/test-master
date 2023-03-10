import React, {useContext} from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ListItemText from "@mui/material/ListItemText";
import InputLabel from "@mui/material/InputLabel";
import Checkbox from "@mui/material/Checkbox";
import api from "../../Services/api";
import {AppDataContext} from "../Context/DataContext";


const UserSelector = ({selectedUsers, setSelectedUsers}) => {
    const data = useContext(AppDataContext)

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };
    const handleChange = async (event) => {
        try {
            await api.put("http://localhost:8800/users/" + data.currentUser.id, {selectedUser: event.target.value})
        } catch (err) {
            console.log(err)
        }
        setSelectedUsers(event.target.value)
    };

    const myUserList = data.userList.map(user => user.id === data.currentUser.id
        ? {...user, first_name: "Мои", last_name: ""}
        : user)

    return (
        <FormControl sx={{m: 3, width: 400}} size="small">
            <InputLabel id="demo-multiple-checkbox-label">
                Показать карточки пользователей
            </InputLabel>
            <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={selectedUsers}
                onChange={handleChange}
                input={<OutlinedInput label="Показать карточки пользователей"/>}
                renderValue={() => selectedUsers.map((selectedUser) => {
                    const user = myUserList.find((userInList) => userInList.id === selectedUser);
                    return user
                        ? user.id !== data.currentUser.id
                        ? user.first_name + " " + user.last_name.split("", 1) + "."
                            : user.first_name
                        : "";
                })
                    .join(", ")
                }

                MenuProps={MenuProps}
            >
                {myUserList
                    .sort((a, b) => {
                        const nameA = a.last_name.toLowerCase(), nameB = b.last_name.toLowerCase();
                        if (nameA < nameB) //сортируем строки по возрастанию
                            return -1
                        if (nameA > nameB)
                            return 1
                        return 0 // Никакой сортировки
                    })
                    .map((user) => {
                        return (
                            <MenuItem key={user.id} value={user.id}>
                                <Checkbox checked={selectedUsers.includes(user.id)}/>
                                <ListItemText primary={user.first_name + " " + user.last_name}/>
                            </MenuItem>
                        );
                    })}
            </Select>
        </FormControl>
    );
};

export default UserSelector;
