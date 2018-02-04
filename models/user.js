module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'user',
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [7, 100],
        },
      },
    },
    {
      hooks: {
        beforeValidate: (user, options) => {
          if (typeof user.email === 'string') {
            user.email = user.email.toLowerCase();
          }
        },
      },
    },
  );
};
