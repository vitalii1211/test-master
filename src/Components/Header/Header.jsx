import React, {useContext} from 'react';
import FormControlLabel from "@mui/material/FormControlLabel";
import {Switch} from "@mui/material";
import Search from "./Search";
import AddTodoItem from "../Todo/AddTodoItem";
import UserSelector from "./UserSelector";
import AuthService from "../../Services/auth.service";
import {useNavigate} from "react-router-dom";
import UserListSortSelector from "./UserListSortSelector";
import {AppDataContext} from "../Context/DataContext";


function Header(props) {
    const data = useContext(AppDataContext)
    const navigate = useNavigate()
    const fullName = props.currentUser.result[0].first_name + " " + props.currentUser.result[0].last_name

    const logout = () => {
        AuthService.logout()
        navigate("/login")
    }

    return (
        <div>
            <FormControlLabel sx={{m: 3}} onClick={props.SwitchEditMode} control={<Switch/>} label={data.editMode ?
                "Редактирование"
                : "Чтение"
            }/>
            <Search
                searchItem={props.searchItem}
                setSearchItem={props.setSearchItem}
            />

            {data.editMode &&
                <AddTodoItem/>
            }

            <UserSelector
            />

            <UserListSortSelector/>

            <strong style={{ paddingRight: "10px" }}> Привет, {fullName}! </strong>
            <button onClick={logout}>Logout</button>
        </div>
    );
}

export default Header;