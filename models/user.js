const bcrypt = require('bcrypt');
const _ = require('underscore');
const cryptojs = require('crypto-js');
const jwt = require('jsonwebtoken');

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

  User.prototype.toPublicJSON = function () {
    let json = this.toJSON();
    return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
  };

  User.prototype.generateToken = function (type) {
    if (!_.isString(type)) {
      return undefined;
    }

    try {
      console.log({ id: this.get('id'), type: type });
      let stringData = JSON.stringify({ asdlk: 'asd' });
      let encryptedData = cryptojs.AES.encrypt(stringData, 'abc123!@#!').toString();

      let token = jwt.sign({
        token: encryptedData,
      }, 'qwerty098');

      return token;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  };

  User.authenticate = function (body) {
    return new Promise((resolve, reject) => {
      if (typeof body.email !== 'string' || typeof body.password !== 'string') {
        return reject();
      }

      User.findOne({ where: { email: body.email } })
        .then(user => {
          if (user && bcrypt.compareSync(body.password, user.get('password_hash'))) {
            return resolve(user);
          } else {
            return reject();
          }
        })
        .catch(e => reject())
    });

  }

  return User;
};
