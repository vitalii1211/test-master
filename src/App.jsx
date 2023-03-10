import React from 'react';
import './App.css';
import BoardList from "./Components/BoardList/BoardList";
import Register from "./Components/Auth/Register";
import Login from "./Components/Auth/Login";
import {Routes, Route, BrowserRouter} from 'react-router-dom'
import PrivateRoute from "./Components/Auth/PrivateRoute";
import DataContext from "./Components/Context/DataContext";
import Test from "./Test/Test"
import Test2 from "./Test2/Test2";
import Test3 from "./Test3/Test3";

function App() {
    return (
        <DataContext>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={
                        <PrivateRoute>
                            <BoardList/>
                        </PrivateRoute>
                    }/>

                    <Route path="/test" element={<Test/>}/>
                    <Route path="/test2" element={<Test2/>}/>
                    <Route path="/test3" element={<Test3/>}/>

                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                </Routes>
            </BrowserRouter>
        </DataContext>
    )
}

export default App;
