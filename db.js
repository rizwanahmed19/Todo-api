const Sequelize = require('sequelize');

const sequelize = new Sequelize(undefined, undefined, undefined, {
  operatorsAliases: Sequelize.Op,
  dialect: 'sqlite',
  storage: __dirname + '/data/dev-todo-api.sqlite',
});

let db = {};
db.todo = sequelize.import(__dirname + '/models/todo.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
