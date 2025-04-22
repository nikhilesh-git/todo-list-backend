const express = require('express')
const app = express()
app.use(express.json())
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const bcrypt=require('bcrypt')  
const path = require('path')
const dbPath = path.join(__dirname, 'todoApplication.db')
const jwt = require('jsonwebtoken');

module.exports = app
let db = null

//db and server initialization
const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDbAndServer()

//user authentication
const authenticateToken = (request, response, next) => {
let jwtToken
const authHeader = request.headers['authorization']
if (authHeader !== undefined) {
    jwtToken = authHeader.split(' ')[1]
}
if (jwtToken === undefined) {
    response.status(401)
    response.send('Invalid Access Token')
} else {
    jwt.verify(jwtToken, 'MY_SECRET_TOKEN', async (error, payload) => {
    if (error) {
        response.status(401)
        response.send('Invalid Access Token')
    } else {
        request.username = payload.username
        next()
    }
    })
}
}

//get todos api
app.get('/todos/',authenticateToken, async (request, response) => {
  const {priority, status, search_q = ''} = request.query
  const username=request.username;
  let getTodosQuery = `
    SELECT *
    FROM todo
    WHERE username='${username}' AND todo LIKE '%${search_q}%'
    `
  if (priority) {
    getTodosQuery += `AND priority='${priority}'`
  }

  if (status) {
    getTodosQuery += `AND status='${status}'`
  }

  const todosArray = await db.all(getTodosQuery)
  response.send(todosArray)
})

//get todo api
app.get('/todos/:todoId/',authenticateToken, async (request, response) => {
  const {todoId} = request.params
  const username=request.username;
  const getTodoQuery = `
  select * from todo
  where id=${todoId} AND username='${username}';
  `
  const todoDbResponse = await db.get(getTodoQuery)
  response.send(todoDbResponse)
})

//create todo api
app.post('/todos/',authenticateToken, async (request, response) => {
  const {todo, priority, status} = request.body
  const username=request.username;
  const postTodoQuery = `
  INSERT INTO todo (username,todo,priority,status)
  VALUES ('${username}','${todo}','${priority}','${status}');
  `
  const dbResponse=await db.run(postTodoQuery)
  const todoId=dbResponse.lastID
  response.send(`Todo Successfully Added with todoId: ${todoId}`)
})

//update todo api
app.put('/todos/:todoId/',authenticateToken, async (request, response) => {
  const {todoId} = request.params
  const {todo, priority, status} = request.body
  const username=request.username;
  let queryParamsArray = []
  if (status) {
    queryParamsArray.push(`status='${status}'`)
  }
  if (priority) {
    queryParamsArray.push(`priority='${priority}'`)
  }
  if (todo) {
    queryParamsArray.push(`todo='${todo}'`)
  }

  const updateTodoQuery = `
  UPDATE todo SET
  ${queryParamsArray.join(',')}
  WHERE id=${todoId} AND username='${username}';`

  await db.run(updateTodoQuery)
  if (status) {
    response.send('Status Updated')
  }
  if (priority) {
    response.send('Priority Updated')
  }
  if (todo) {
    response.send('Todo Updated')
  }
})

//delete todo api
app.delete('/todos/:todoId/',authenticateToken, async (request, response) => {
  const {todoId} = request.params
  const username=request.username;
  const deleteTodoQuery = `
  DELETE FROM todo
  where id=${todoId} AND username='${username}';
  `
  await db.run(deleteTodoQuery)
  response.send('Todo Deleted')
})

//user register api
app.post("/users/", async (request, response) => {
const { username, name, password, gender, location } = request.body;
const hashedPassword = await bcrypt.hash(request.body.password, 10);
const selectUserQuery = `SELECT * FROM user WHERE username = '${username}'`;
const dbUser = await db.get(selectUserQuery);
if (dbUser === undefined) {
    const createUserQuery = `
    INSERT INTO 
        user (username, name, password, gender, location) 
    VALUES 
        (
        '${username}', 
        '${name}',
        '${hashedPassword}', 
        '${gender}',
        '${location}'
        )`;
    const dbResponse = await db.run(createUserQuery);
    const newUserId = dbResponse.lastID;
    response.send(`Created new user with ${newUserId}`);
} else {
    response.status = 400;
    response.send("User already exists");
}
});

//user login api
app.post("/login/", async (request, response) => {
const { username, password } = request.body;
const selectUserQuery = `SELECT * FROM user WHERE username = '${username}'`;
const dbUser = await db.get(selectUserQuery);
if (dbUser === undefined) {
    response.status(400);
    response.send("Invalid User");
} else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    if (isPasswordMatched === true) {
    const payload = {
        username: username,
    };
    const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
    response.send({ jwtToken });
    } else {
    response.status(400);
    response.send("Invalid Password");
    }
}
});

//get profile api
app.get('/profile/', authenticateToken, async (request, response) => {
    let {username} = request
    const getUserQuery = `
    select * from user where username='${username}';
    `
    const userDetails = await db.get(getUserQuery)
    response.send(userDetails)
  })