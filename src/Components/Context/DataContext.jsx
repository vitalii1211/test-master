import React, {useEffect, useState, createContext} from 'react';
import UserService from "../../Services/user.service";
import AuthService from "../../Services/auth.service";

export const AppDataContext = createContext()

function DataContext({children}) {
    const [todoList, setTodoList] = useState([])
    const [taskList, setTaskList] = useState([])
    const [userList, setUserList] = useState([])
    const getCurrentUser = AuthService.getCurrentUser();
    const currentUser = getCurrentUser?.result[0]
    useEffect(() => {
        UserService.getTodoList()
            .then(response => {
                    setTodoList(response.data)
                },
                (error) => {
                    console.log(error)
                })
    }, []); // через запрос с БД и рендеринг, иначе фильтр Task-ов карточки не обновляется
    // при сркытии/открытии карточек пользователя

    useEffect(() => {
        UserService.getTaskList()
            .then(response => {
                    setTaskList(response.data)
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
    }

    return <AppDataContext.Provider value={value}>
        {children}
    </AppDataContext.Provider>
}

export default DataContext;