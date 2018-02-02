const Sequelize = require('sequelize');

let sequelize;
let env = process.env.NODE_ENV || 'development';
let Op = Sequelize.Op;

if (env === 'production') {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgresql',
    operatorsAliases: {
      $like: Op.iLike,
    },
    typeValidation: true,
  });
} else {
  sequelize = new Sequelize(undefined, undefined, undefined, {
    operatorsAliases: {
      $like: Op.like,
    },
    dialect: 'sqlite',
    storage: __dirname + '/data/dev-todo-api.sqlite',
    typeValidation: true,
  });
}

let db = {};
db.todo = sequelize.import(__dirname + '/models/todo.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
