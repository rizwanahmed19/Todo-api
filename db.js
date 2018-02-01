const Sequelize = require('sequelize');

let sequelize;
let env = process.env.NODE_ENV || 'development';

if (env === 'production') {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgresql',
  });
} else {
  sequelize = new Sequelize(undefined, undefined, undefined, {
    operatorsAliases: Sequelize.Op,
    dialect: 'sqlite',
    storage: __dirname + '/data/dev-todo-api.sqlite',
  });
}

let db = {};
db.todo = sequelize.import(__dirname + '/models/todo.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
