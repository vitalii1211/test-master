import React from "react"
import {Navigate} from "react-router-dom";
import TokenService from "../../Services/token.service";

const PrivateRoute = ({ children }) => {
    const user = TokenService.getUser()
    return user ? children : <Navigate to="/login"/>
}

export default PrivateRoute;