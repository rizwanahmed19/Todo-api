const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

let todos = [
  {
    id: 1,
    description: 'Water the plants',
    completed: false,
  },
  {
    id: 2,
    description: 'Go to market',
    completed: false,
  },
];

app.get('/', (req, res) => {
  res.send('Todo API root');
});

app.get('/todos', (req, res) => {
  res.json(todos);
});

app.get('/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);

  const todo = todos.filter(todo => todo.id === todoId);

  if (todo.length > 0) {
    res.json(todo);
  } else {
    res.status(404).send('Todo does not exist!');
  }
});

app.listen(PORT, () => {
  console.log('App is up on port', PORT);
});
