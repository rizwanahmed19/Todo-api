const express = require('express');
const bodyParser = require('body-parser');
const _ = require('underscore');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

let todos = [];
let todoNextId = 1;

// GET /todos?completed=true&q=house
app.get('/todos', (req, res) => {
  const queryParams = req.query;
  let filteredTodos = todos;

  if (
    queryParams.hasOwnProperty('completed') &&
    queryParams.completed === 'true'
  ) {
    filteredTodos = _.where(todos, { completed: true });
  } else if (
    queryParams.hasOwnProperty('completed') &&
    queryParams.completed === 'false'
  ) {
    filteredTodos = _.where(todos, { completed: false });
  }

  if (queryParams.hasOwnProperty('q') && queryParams.q.trim().length > 0) {
    filteredTodos = filteredTodos.filter(
      todo =>
        todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > 0,
    );
  }

  res.json(filteredTodos);
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

  res.json(todos);
});

// DELETE /todos/:id
app.delete('/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  const matchedTodo = _.findWhere(todos, { id: todoId });

  if (!matchedTodo) {
    res.status(404).json({ error: 'Todo does not exist' });
  } else {
    todos = _.without(todos, matchedTodo);
    res.json(matchedTodo);
  }
});

// PUT /todos/:id
app.put('/todos/:id', (req, res) => {
  const body = _.pick(req.body, 'description', 'completed');
  const todoId = parseInt(req.params.id);
  const matchedTodo = _.findWhere(todos, { id: todoId });
  const validAttributes = {};

  if (!matchedTodo) {
    return res.status(400).send();
  }

  if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
    validAttributes.completed = body.completed;
  } else if (body.hasOwnProperty('completed')) {
    return res.status(400).send();
  }

  if (
    body.hasOwnProperty('description') &&
    _.isString(body.description) &&
    body.description.trim().length > 0
  ) {
    validAttributes.description = body.description;
  } else if (body.hasOwnProperty('description')) {
    return res.status(400).send();
  }

  _.extend(matchedTodo, validAttributes);
  res.json(matchedTodo);
});

app.listen(PORT, () => {
  console.log('App is up on port', PORT);
});
