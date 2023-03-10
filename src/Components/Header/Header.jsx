import React, {useContext} from 'react';
import FormControlLabel from "@mui/material/FormControlLabel";
import {Switch} from "@mui/material";
import Search from "../Search";
import AddTodoItem from "../Todo/AddTodoItem";
import UserSelector from "./UserSelector";
import AuthService from "../../Services/auth.service";
import {useNavigate} from "react-router-dom";
import {AppDataContext} from "../Context/DataContext";
import UserListSortSelector from "./UserListSortSelector";


function Header(props) {
    const data = useContext(AppDataContext)
    const navigate = useNavigate()
    const fullName = data.currentUser.first_name + " " + data.currentUser.last_name

    const logout = () => {
        AuthService.logout()
        navigate("/login")
    }

    return (
        <div>
            <FormControlLabel sx={{m: 3}} onClick={props.SwitchEditMode} control={<Switch/>} label={props.editMode ?
                "Редактирование"
                : "Чтение"
            }/>
            <Search
                searchItem={props.searchItem}
                setSearchItem={props.setSearchItem}
            />

            {props.editMode &&
                <AddTodoItem/>
            }

            <UserSelector
                userList={data.userList}
                selectedUsers={props.selectedUsers}
                setSelectedUsers={props.setSelectedUsers}
            />

            <UserListSortSelector
                sortType={props.sortType}
                setSortType={props.setSortType}
            />

            <strong style={{ paddingRight: "10px" }}> Привет, {fullName}! </strong>
            <button onClick={logout}>Logout</button>
        </div>
    );
}

export default Header;