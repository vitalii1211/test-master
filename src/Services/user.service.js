import api from "./api";

const API_URL = "http://localhost:8800/";

const getTodoList = () => {
    return api.get(API_URL + "todo");
};

const getTaskList = () => {
    return api.get(API_URL + "task");
};

const getUserList = () => {
    return api.get(API_URL + "users");
};

const UserService = {
    getTodoList,
    getTaskList,
    getUserList,
};

export default UserService;