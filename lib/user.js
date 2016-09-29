'use strict';

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    google_id: DataTypes.STRING,
    email: DataTypes.STRING,
    github_login: DataTypes.STRING,
    display_name: DataTypes.STRING,
    display_image: DataTypes.STRING,
    google_refresh_token: DataTypes.STRING,
    github_refresh_token: DataTypes.STRING
  }, {
    underscored: true,
    classMethods: {
      isExist: function isExist(email) {
        return this.find({
          where: { email: email }
        }).then(function (instance) {
          return instance !== null;
        });
      },
      getUserById: function getUserById(id) {
        return this.findById(id);
      },
      getUsers: function getUsers() {
        return this.findAll();
      },
      getUsersCount: function getUsersCount() {
        return this.count();
      },
      getUserProject: function getUserProject(id) {
        return this.findAll({
          where: { id: id },
          include: [{
            model: this.associations.projects.target
          }]
        });
      }
    }
  });
};