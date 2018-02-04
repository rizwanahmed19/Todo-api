const bcrypt = require('bcrypt');
const _ = require('underscore');

module.exports = (sequelize, DataTypes) => {
  let User = sequelize.define(
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
      salt: {
        type: DataTypes.STRING,
      },
      password_hash: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.VIRTUAL,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [7, 100],
        },
        set(value) {
          const salt = bcrypt.genSaltSync(10);
          const hashedPassword = bcrypt.hashSync(value, salt);

          this.setDataValue('password', value);
          this.setDataValue('salt', salt);
          this.setDataValue('password_hash', hashedPassword);
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

  User.prototype.toPublicJSON = function() {
    let json = this.toJSON();
    return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
  };

  return User;
};
