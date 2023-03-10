import axios from "axios";
import TokenService from "./token.service";
import api from "./api";


const API_URL = "http://localhost:8800/";
axios.defaults.withCredentials = true;

const register = (username, email, password) => {
    // Пока не используется, регистрация идет напрямую - перенсти сюда, как и login
    return axios.post(API_URL + "signup", {
        username,
        email,
        password,
    });
};

const login = async (userEmail, userPassword) => {
    try {
    await api.post(API_URL + "login", {
            userEmail,
            userPassword,
        })
        .then((response) => {
            if (response.data.accessToken) {
                TokenService.setUser(response.data)
            }
            return response.data;
        })}
    catch (err) {
        console.log(err)
    };
};

const logout = () => {
    TokenService.removeUser()
    // localStorage.removeItem("user");
    };

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
};

export default AuthService;