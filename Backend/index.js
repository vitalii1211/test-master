import express from "express"
import mysql from "mysql"
import cors from "cors"
import bcrypt from 'bcrypt'
import cookieParser from 'cookie-parser'
import bodyParser from "body-parser";
import session from 'express-session'
import jwt from 'jsonwebtoken'

const app = express()

app.use(express.json())
app.use(cors({
    origin: ("http://localhost:3000"),
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))
app.use(session({
    key: "userid",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24,
    }
}))

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "new_schema"
})
const saltRounds = 10

// middleware
const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"]
    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    } else {
        jwt.verify(token, "jwtSecret", (err, decoded) => {
            if (err) {
                if (err instanceof jwt.TokenExpiredError) {
                    return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
                }
                return res.sendStatus(401).send({ message: "Unauthorized!" });
            } else {
                req.userId = decoded.id;
                next();
            }
        })
    }
}

app.post("/login", (req, res) => {
    const email = req.body.userEmail
    const password = req.body.userPassword
    // отправиляет е-мейл и пароль, получает в ответ ПОЛЬЗОВАТЕЛЯ
    const q = "SELECT * FROM users WHERE email = ?"
    db.query(q, email, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            if (result.length > 0) {
                bcrypt.compare(password, result[0].password, (err, response) => {
                    if (response) {
                        const id = result[0].id
                        // Генерируем новый refresh token
                        const refreshToken = jwt.sign({id}, 'refreshTokenSecret', { expiresIn: '30d' });
                        // Сохраняем refreshToken в базу данных
                        db.query('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, id]);
                        const token = jwt.sign({id}, "jwtSecret", {
                            expiresIn: 60,
                        })
                        // зачем нужна строка ниже? Если удалить, все работает
                        req.session.user = result;
                        res.json({auth: true, accessToken: token, refreshToken: refreshToken, id: id, result: result})
                    } else {
                        res.json({auth: false, message: "Неверный е-мейл или пароль"})
                    }
                });
            } else {
                res.json({auth: false, message: "Пользователь не найден"})
            }
        }
    })
})
app.post('/refresh_token', (req, res) => {

    const refreshToken = req.body.refreshToken;
    if (refreshToken == null) return res.sendStatus(401);
    jwt.verify(refreshToken, 'refreshTokenSecret', async (err, user) => {
        if (err) return res.sendStatus(403);
        const q = 'SELECT * FROM users WHERE id = ?';
        db.query(q, req.body.user.id, (err, result) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            } else {
                if (result.length > 0) {
                    const id = result[0].id;
                    const token = jwt.sign({id}, "jwtSecret", {
                        expiresIn: 60,
                    })
                    // зачем нужна строка ниже? Если удалить, все работает
                    req.session.user = result;
                    res.json({auth: true, accessToken: token, refreshToken: refreshToken, id: id, result: result})
                } else {
                    return res.sendStatus(404);
                }
            }
        });
    });
});
app.post("/register", (req, res) => {
    const id = req.body.id
    const userFirstName = req.body.userFirstName
    const userLastName = req.body.userLastName
    const userEmail = req.body.userEmail
    const userPassword = req.body.userPassword
// проверка, нет ли такого пользователя (е-мейл)
    const ifUserExist = "SELECT * FROM users WHERE email = ?"
    db.query(ifUserExist, userEmail, (err, result) => {
        if (result.length > 0) {
            res.json({message: "Такой пользователи уже зарегистрирован, войдите", result: result})
        } else {
// добавление нового пользователя в БД
            bcrypt.hash(userPassword, saltRounds, (err, hash) => {
                const q = "INSERT INTO users (id, first_name, last_name, email, password) VALUES (?, ?, ?, ?, ?)"
                db.query(q, [id, userFirstName, userLastName, userEmail, hash], (err) => {
                    if (err) return res.json(err)
                    res.json({message: "Пользователь создан"})
                })
            })
            if (err) {
                console.log(err)
            }
        }
    })
})

app.get("/users", verifyJWT, (req, res) => {
    const q = "SELECT * FROM users;"
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})
app.put("/users/:id", verifyJWT, (req, res) => {
    const id = req.params.id;
    const selectedUsers = JSON.stringify(req.body.selectedUser); // преобразование массива в строку JSON
    const q = "UPDATE users SET selectedUsers = ? WHERE id = ?";

    db.query(q, [selectedUsers, id], (err) => {
        if (err) return res.json(err);
        return res.json("Данные успешно записаны!");
    });
});
app.put("/updateUser/:id", verifyJWT, (req, res) => {
    let q;
    let values;
    if (req.body.position) {
        q = "UPDATE users SET position = ? WHERE id = ?";
        values = [req.body.position, req.params.id];
    } else if (req.body.sort_type) {
        q = "UPDATE users SET sort_type = ? WHERE id = ?";
        values = [req.body.sort_type, req.params.id];
    } else {
        return res.json("Не передано значение для обновления");
    }
    db.query(q, values, (err) => {
        if (err) return res.json(err);
        return res.json("Данные успешно записаны!");
    });
});



app.get("/todo", verifyJWT, (req, res) => {
    const q = "SELECT * FROM todo_list;"
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})
app.post("/todo", verifyJWT, (req, res) => {
    const values = [
        req.body.name,
        req.body.author,
        req.body.filter
    ]
    const q = "INSERT INTO todo_list (name, author, filter) VALUES (?)"

    db.query(q, [values], (err, results) => {
        if (err) return res.json(err)
        return res.json(results.insertId)
    })
})
app.put("/todo/:id", verifyJWT, (req, res) => {
    let q, values;
    const id = req.params.id;
    if (req.body.name || req.body.filter) {
        q = "UPDATE todo_list SET name = ?, filter = ? WHERE id = ?"
        values = [req.body.name, req.body.filter]
    } else if (req.body.position && !req.body.author) {
        q = "UPDATE todo_list SET position = ? WHERE id = ?"
        values = [req.body.position]
    } else if (req.body.position && req.body.position) {
        q = "UPDATE todo_list SET position = ?, author = ? WHERE id = ?"
        values = [req.body.position, req.body.author]
    }
    db.query(q, [...values, id], (err) => {
        if (err) return res.json(err)
        return res.json("Данные успешно записаны!")

    })
})
app.delete("/todo/:id", verifyJWT, (req, res) => {
    const todo_id = req.params.id;
    const q = "DELETE FROM todo_list WHERE id = ?"
    db.query(q, [todo_id], (err) => {
        if (err) return res.json(err)
        return res.json("Данные успешно удалены!")
    })
});

app.get("/task", verifyJWT, (req, res) => {
    const q = "SELECT * FROM task_list;"
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})
app.post("/task", verifyJWT,  (req, res) => {
    const values = [
        req.body.todo_id,
        req.body.title,
        req.body.isDone,
        req.body.isDeleted,
        req.body.dateTime
    ]
    const q = "INSERT INTO task_list (todo_id, title, isDone, isDeleted, dateTime) VALUES (?)"

    db.query(q, [values], (err, results) => {
        if (err) return res.json(err)
        return res.json(results.insertId)
    })
})
app.put("/task/:id", verifyJWT, (req, res) => {
    const id = req.params.id;
    const q = "UPDATE task_list SET isDeleted = ?, isDone = ?, title = ? WHERE id = ?"
    const values = [
        req.body.isDeleted,
        req.body.isDone,
        req.body.title
    ]

    db.query(q, [...values, id], (err, results) => {
        if (err) return res.json(err)
        return res.json(results.insertId)
    })
})
app.delete("/task/:id", verifyJWT, (req, res) => {
    const id = req.params.id;
    const q = "DELETE FROM task_list WHERE id = ?"
    db.query(q, [id], (err) => {
        if (err) return res.json(err)
        return res.json("Данные успешно удалены!")
    })
});

app.listen(8800, () => {
    console.log('connection!')
});

export default db;