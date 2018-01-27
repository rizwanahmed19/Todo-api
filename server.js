const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

let todos = [];
let todoNextId = 1;

// GET /todos
app.get('/todos', (req, res) => {
  res.json(todos);
});

// GET todos/:id
app.get('/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);

  const todo = todos.filter(todo => todo.id === todoId);

  if (todo.length > 0) {
    res.json(todo);
  } else {
    res.status(404).send('Todo does not exist!');
  }
});

// POST /todos
app.post('/todos', (req, res) => {
  const body = req.body;

  body.id = todoNextId++;

  todos.push(body);

  res.json(body);
});

app.listen(PORT, () => {
  console.log('App is up on port', PORT);
});
