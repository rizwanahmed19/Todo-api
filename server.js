const express = require('express');
const bodyParser = require('body-parser');
const _ = require('underscore');

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

  const matchedTodo = _.findWhere(todos, { id: todoId });

  if (matchedTodo) {
    res.json(matchedTodo);
  } else {
    res.status(404).send('Todo does not exist!');
  }
});

// POST /todos
app.post('/todos', (req, res) => {
  const body = _.pick(req.body, 'description', 'completed');

  if (
    !_.isBoolean(body.completed) ||
    !_.isString(body.description) ||
    body.description.trim().length === 0
  ) {
    return res.status(400).send();
  }

  body.description = body.description.trim();

  body.id = todoNextId++;

  todos.push(body);

  res.json(body);
});

app.listen(PORT, () => {
  console.log('App is up on port', PORT);
});
