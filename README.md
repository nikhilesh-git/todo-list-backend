Here's a clean and professional `README.md` file for your Node.js server-side application:

---

# 📝 Todo Application API

A simple and secure server-side Todo management system built using **Node.js**, **Express**, **SQLite**, **JWT**, and **bcrypt**. This API allows users to register, log in, and manage personal todo lists.

---

## 🚀 Features

- **User Registration & Login**
- **JWT Authentication for All Routes**
- **CRUD APIs for Todos**
- **Filter Todos by Priority, Status, or Search Query**
- **Profile Retrieval**

---

## 🧰 Tech Stack

- **Node.js** & **Express.js**
- **SQLite** with `sqlite3` and `sqlite`
- **bcrypt** for password hashing
- **jsonwebtoken** for secure authentication

---

## 📂 Project Structure

```
.
├── app.js              # Main server file with API logic
├── todoApplication.db  # SQLite database
├── package.json        # Project dependencies
├── app.http            # HTTP test cases (REST client)
└── README.md           # Project documentation
```

---

## 🛠️ Installation

1. **Clone the repository**

```bash
git clone https://github.com/nikhilesh-git/todo-list-backend.git
cd todo-list-backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the server**

```bash
nodemon app.js
```

The server will start at: `http://localhost:3000/`

---

## 🧪 Test Endpoints (Using REST Client or Postman)

### 🔐 Authentication

- **Register User**

```http
POST /users/
Content-Type: application/json

{
  "username": "rahul12345",
  "name": "Rahul",
  "password": "rahul@456",
  "gender": "male",
  "location": "hyderabad"
}
```

- **Login User**

```http
POST /login/
Content-Type: application/json

{
  "username": "rahul12345",
  "password": "rahul@456"
}
```

- **Get Profile**

```http
GET /profile/
Authorization: Bearer <jwt_token>
```

---

### 📋 Todo APIs (All require Authorization Header)

- **Get All Todos**
```http
GET /todos/
```

- **Filter Todos**
```http
GET /todos/?priority=HIGH&status=IN%20PROGRESS
GET /todos/?search_q=Play
```

- **Get Single Todo**
```http
GET /todos/5/
```

- **Create Todo**
```http
POST /todos/
Content-Type: application/json

{
  "todo": "Learn JS",
  "priority": "MEDIUM",
  "status": "IN PROGRESS"
}
```

- **Update Todo**
```http
PUT /todos/5/
Content-Type: application/json

{ "status": "DONE" }
```

- **Delete Todo**
```http
DELETE /todos/5/
```

---

## 🗃️ Database Schema

### `user` Table

| Field     | Type    |
|-----------|---------|
| username  | TEXT PK |
| name      | TEXT    |
| password  | TEXT    |
| gender    | TEXT    |
| location  | TEXT    |

### `todo` Table

| Field     | Type    |
|-----------|---------|
| id        | INTEGER PK |
| username  | TEXT    |
| todo      | TEXT    |
| priority  | TEXT    |
| status    | TEXT    |

---

## 🔐 Authentication

JWT-based authentication is implemented. All protected routes must include:

```http
Authorization: Bearer <jwt_token>
```

---

## 🧱 Dependencies

```json
"dependencies": {
  "bcrypt": "^5.1.1",
  "express": "^5.1.0",
  "jsonwebtoken": "^9.0.2",
  "nodemon": "^3.1.9",
  "sqlite": "^5.1.1",
  "sqlite3": "^5.1.7"
}
```

---

## 📜 License

This project is licensed under the MIT License.

---

Let me know if you want to add badges, deploy info, or Docker setup too.
