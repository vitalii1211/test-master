import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {Link as RouterLink, LinkProps as RouterLinkProps, useNavigate} from 'react-router-dom';
import {useEffect, useState, useRef} from "react";
import AcUnitIcon from '@mui/icons-material/AcUnit';

import AuthService from "../../Services/auth.service";

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();

export default function Login(props) {
    let navigate = useNavigate();

    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        AuthService.login(userEmail, userPassword)
            .then(() => {
                navigate("/")
            })
        };


    return (

        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        <AcUnitIcon/>
                        Login
                    </Typography>
                    <Box component="form" onSubmit={handleLogin} noValidate sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={(e) => setUserEmail(e.target.value)}
                            value={userEmail}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={(e) => setUserPassword(e.target.value)}
                            value={userPassword}
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary"/>}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link component={RouterLink} to="/register" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{mt: 8, mb: 4}}/>
            </Container>
        </ThemeProvider>
    );
}

// const [loginStatus, setLoginStatus] = useState(false)
// const handleSubmitLogin = async (event) => {
//     event.preventDefault();
//     const userLogin = {
//         userEmail: userEmail,
//         userPassword: userPassword
//     }
//     try {
//         await axios.post('http://localhost:8800/loginOnSubmit', userLogin)
//             .then((response) => {
//                 if (!response.data.auth) {
//                     setLoginStatus(false)
//                 } else {
//                     localStorage.setItem("token", response.data.token)
//                     setLoginStatus(true)
//                     console.log("response.data @handleSubmitLogin", response.data)
//                 }
//             });
//     } catch (err) {
//         console.log(err)
//     }
// };
//
// useEffect(() => {
//     axios.get("http://localhost:8800/login")
//         .then(
//             (response) => {
//                 if (response.data.loggedIn) {
//                     setLoginStatus(true)
//                 }
//             }
//         )
// }, [])
//
// const userAuthenticated = () => {
//     axios.get("http://localhost:8800/isUserAuth", {
//         headers: {
//             "x-access-token": localStorage.getItem("token")
//         }
//     })
//         .then((response) => {
//             console.log(response.data)
//
//         })
// }
//
// const userLoggedIn = () => {
//     axios.get("http://localhost:8800/login")
//         .then(
//             (response) => {
//                 console.log("loggedIn", response.data.loggedIn)
//             }
//         )
// }