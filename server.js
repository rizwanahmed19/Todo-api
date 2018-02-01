const express = require('express');
const bodyParser = require('body-parser');
const _ = require('underscore');

const db = require('./db');
// const Op = db.Sequelize.Op;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

let todos = [];
let todoNextId = 1;

// GET /todos?completed=true&q=house
app.get('/todos', (req, res) => {
  const query = req.query;
  let where = {};

  if (query.hasOwnProperty('completed') && query.completed === 'true') {
    where.completed = true;
  } else if (query.hasOwnProperty('completed') && query.completed === 'false') {
    where.completed = false;
  }

  if (query.hasOwnProperty('q') && query.q.length > 0) {
    where.description = {
      $like: '%' + query.q + '%',
    };
  }

  db.todo
    .findAll({ where: where })
    .then(todos => {
      res.json(todos);
    })
    .catch(e => {
      res.status(500).json(e);
    });
});

// GET todos/:id
app.get('/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);

  db.todo
    .findById(todoId)
    .then(todo => {
      if (!!todo) {
        res.json(todo.toJSON());
      } else {
        res.status(404).send();
      }
    })
    .catch(e => {
      res.status(500).send();
    });
});

// POST /todos
app.post('/todos', (req, res) => {
  const body = _.pick(req.body, 'description', 'completed');

  db.todo
    .create(body)
    .then(todo => {
      res.json(todo.toJSON());
    })
    .catch(e => {
      res.status(400).json(e);
    });
});

// DELETE /todos/:id
app.delete('/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);

  db.todo
    .destroy({
      where: {
        id: todoId,
      },
    })
    .then(rowsDeleted => {
      if (rowsDeleted === 0) {
        res.status(404).json({
          error: 'No todo exist with that id',
        });
      } else {
        res.status(204).send();
      }
    })
    .catch(e => {
      res.status(500).send();
    });

  // if (!matchedTodo) {
  //   res.status(404).json({ error: 'Todo does not exist' });
  // } else {
  //   todos = _.without(todos, matchedTodo);
  //   res.json(matchedTodo);
  // }
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

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log('App is up on port', PORT);
  });
});
