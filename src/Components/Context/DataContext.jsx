import React, {useEffect, useState, createContext} from 'react';
import UserService from "../../Services/user.service";
import AuthService from "../../Services/auth.service";

export const AppDataContext = createContext()

function DataContext({children}) {
    const [todoList, setTodoList] = useState([])
    const [taskList, setTaskList] = useState([])
    const [userList, setUserList] = useState([])
    const [currentUser, setCurrentUser] = useState({})
    const [sortType, setSortType] = useState("")
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [editMode, setEditMode] = useState(false)


    const getCurrentUser = AuthService.getCurrentUser();

    useEffect(() => {
        UserService.getTodoList()
            .then(response => {
                    setTodoList(response.data)
                },
                (error) => {
                    console.log(error)
                })
    }, []);

    useEffect(() => {
        UserService.getTaskList()
            .then(response => {
                    setTaskList(response.data)
                },
                (error) => {
                    console.log(error)
                });
    }, []);

    useEffect(() => {
        UserService.getUserList()
            .then(response => {
                    setUserList(response.data)
                    setCurrentUser(getCurrentUser.result[0])
                    const findCurrentUser = response.data.find(a => a.id === getCurrentUser.result[0].id)
                    setSortType(findCurrentUser.sort_type)
                    if (findCurrentUser.selectedUsers) {
                        const selectedUsersOfCurrentUser = JSON.parse(findCurrentUser.selectedUsers)
                        setSelectedUsers(selectedUsersOfCurrentUser)
                    } else { // если массива нет - например, null у нового пользователя
                        setSelectedUsers([])
                    }
                },
                (error) => {
                    console.log(error)
                });
    }, []);

    const value = {
        todoList,
        setTodoList,
        taskList,
        setTaskList,
        userList,
        setUserList,
        currentUser,
        setCurrentUser,
        sortType,
        setSortType,
        selectedUsers,
        setSelectedUsers,
        editMode,
        setEditMode,
    }

    return <AppDataContext.Provider value={value}>
        {children}
    </AppDataContext.Provider>
}

export default DataContext;