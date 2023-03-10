import React, {useEffect, useState, useContext} from 'react';
import '../../App.css';
import Header from "../Header/Header";
import Grid from "@mui/material/Grid";
import UserService from "../../Services/user.service";
import {AppDataContext} from "../Context/DataContext";
import api from "../../Services/api";
import BoardItem from "./BoardItem";
import {
    DndContext,
    DragOverlay,
    MouseSensor,
    rectIntersection,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import Droppable from "./Droppable";
import {TodoItem} from "../Todo/TodoItem";
import AuthService from "../../Services/auth.service";

function BoardList({API_URL}) {
    const data = useContext(AppDataContext)
    const getCurrentUser = AuthService.getCurrentUser();

    const [editMode, setEditMode] = useState(false)
    const [searchItem, setSearchItem] = useState("")
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [sortType, setSortType] = useState("")
    const [activeTodo, setActiveTodo] = useState(null)
    const [currentUser, setCurrentUser] = useState(getCurrentUser)

    const items = data.todoList
    const containers = data.userList

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 10,
            }
        }),
    );

    useEffect(() => {
        UserService.getUserList()
            .then(response => {
                    data.setUserList(response.data)
                    data.setCurrentUser(getCurrentUser.result[0])
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

    function SwitchEditMode() {
        setEditMode(!editMode)
    }

    // блок скрытия карточке по поиску
    const foundInTodo = data.todoList
        .filter(item => item.name.toLowerCase().includes(searchItem.toLowerCase()))
        .map(item => item.id)
    const foundInTask = data.taskList
        .filter(item => item.title.toLowerCase().includes(searchItem.toLowerCase()))
        .map(item => item.todo_id)
    const foundEverywhere = foundInTodo.concat(foundInTask)
    const foundEverywhereUnique = foundEverywhere.reduce((acc, value) => {
        if (!acc.includes(value)) {
            acc.push(value)
        }
        return acc
    }, [])
    const todoListAfterSearch = data.todoList.filter(item => foundEverywhereUnique.includes(item.id))

    const orderedUserList = selectedUsers.map((id) =>
        data.userList.find((user) => user.id === id)
    );

    const sorted10 = [...orderedUserList].sort(
        ((a, b) => {
            const nameA = a.last_name.toLowerCase(), nameB = b.last_name.toLowerCase();
            if (nameA < nameB) //сортируем строки по возрастанию
                return -1
            if (nameA > nameB)
                return 1
            return 0 // Никакой сортировки
        })
    )
    const withoutCurrentUser = [...sorted10].filter(item => item.id !== data.currentUser.id)
    const sorted20 = [data.currentUser].concat(withoutCurrentUser)
    const sorted30 = orderedUserList

    let boardList;
    if (sortType === "10") {
        boardList = sorted10;
    } else if (sortType === "20") {
        boardList = sorted20;
    } else if (sortType === "30") {
        boardList = sorted30;
    }

    const boardItems = todoListAfterSearch.filter(todo => todo.author === data.currentUser.id)

    function dragStartHandler(event) {
        const {active} = event;
        const activeTodo = data.todoList.find(todo => todo.id === active.id)
        const activeUser = data.userList.map(user => user.id === activeTodo.author)
        setActiveTodo(activeTodo)
        setCurrentUser(activeUser)
    }

    function dragOverHandler(event) {
        const {active, over} = event;
        console.log("active", active)
        console.log("over", over)
    }


    function dragEndHandler(event) {
        const {active, over} = event;
        const activeItem = items.find(item => item.id === active.id)
        const overItem = items.find(item => item.id === over.id)
        const overContainer = containers.find(item => item.id === over.id)

        if (overContainer) {
            if (activeItem.author === overContainer.id) {
                const overContainerItems = items.filter(item => item.author === over.id)
                const updatedItems = items.map(item => {
                    if ((item.author === overContainer.id) && (item.position > activeItem.position)) {
                        return {...item, position: item.position - 1}
                    }
                    if (item.id === active.id) {
                        return {...item, position: overContainerItems.length, author: overContainer.id}
                    }
                    return item
                })
                data.setTodoList(updatedItems)
            }
            if (activeItem.author !== overContainer.id) {
                const overItems = items.filter(item => item.author === over.id)
                const updatedItems = items.map(item => {
                    if (item.id === active.id) {
                        return {...item, position: overItems.length + 1, author: overContainer.id}
                    }
                    if ((item.author === activeItem.author) && (item.position > activeItem.position)) {
                        return {...item, position: item.position - 1}
                    }
                    return item
                })
                data.setTodoList(updatedItems)
            }
        }

        if (overItem) {
            if (activeItem.author === overItem.author) {
                const updatedItems = items.map(item => {
                    if (item.id === activeItem.id) {
                        return {...item, position: overItem.position}
                    }
                    if (item.id === overItem.id) {
                        return {...item, position: activeItem.position}
                    }
                    return item
                })
                data.setTodoList(updatedItems)
            }
            if (activeItem.author !== overItem.author) {
                const updatedItems = items.map(item => {
                    if (item.id === activeItem.id) {
                        return {...item, position: overItem.position, author: overItem.author}
                    }
                    if ((item.author === overItem.author) && (item.position >= overItem.position)) {
                        return {...item, position: item.position + 1}
                    }
                    if ((item.author === activeItem.author) && (item.position > activeItem.position)) {
                        return {...item, position: item.position - 1}
                    }
                    return item
                })
                data.setTodoList(updatedItems)
            }
        }
        setActiveTodo(null)

    }

    return (
        <div>
            <Header
                editMode={editMode}
                SwitchEditMode={SwitchEditMode}
                searchItem={searchItem}
                setSearchItem={setSearchItem}
                selectedUsers={selectedUsers}
                setSelectedUsers={setSelectedUsers}
                sortType={sortType}
                setSortType={setSortType}
                currentUser={currentUser}
            />
            <DndContext
                sensors={sensors}
                collisionDetection={rectIntersection}
                onDragStart={dragStartHandler}
                onDragOver={dragOverHandler}
                onDragEnd={dragEndHandler}
            >
                <Grid container spacing={2} columns={16} style={{paddingInline: '30px'}}>
                    {boardList &&
                        boardList
                            .filter(user => selectedUsers.includes(user.id))
                            .map(user =>
                                <Droppable id={user.id} key={user.id}>
                                    <BoardItem
                                        key={user.id}
                                        user={user}
                                        todoListAfterSearch={todoListAfterSearch}
                                        editMode={editMode}
                                        searchItem={searchItem}
                                        sortType={sortType}
                                        items={boardItems}
                                        activeTodo={activeTodo}
                                    />
                                </Droppable>
                            )
                    }
                </Grid>
                <DragOverlay>
                    <TodoItem
                        todoItem={activeTodo}
                        editMode={editMode}
                        searchItem={searchItem}
                        setSearchItem={setSearchItem}
                        user={currentUser}
                        todolistFinal={data.todoList}
                    />
                </DragOverlay>
            </DndContext>
        </div>
    )
}

export default BoardList;
