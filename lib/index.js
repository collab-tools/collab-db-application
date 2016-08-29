'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Sequelize = require('sequelize');

// Setup Sequelize and Connection with Database
// ======================================================

exports.default = function (config) {
  var dbName = config('name');
  var dbUsername = config('username');
  var dbPassword = config('password');
  var dbOptions = config('options');

  var models = {};
  var sequelize = new Sequelize(dbName, dbUsername, dbPassword, dbOptions);
  models.sequelize = sequelize;

  var modelFiles = ['milestone', 'task', 'user', 'project', 'user-project', 'notification', 'newsfeed'];

  modelFiles.forEach(function (model) {
    models[model] = sequelize.import(__dirname + '/' + model);
  });

  // Setup relations and associations between models based on database design
  // ========================================================================
  models.task.belongsTo(models.milestone);
  models.task.belongsTo(models.project);

  models.milestone.belongsTo(models.project);
  models.milestone.hasMany(models.task);

  models.project.belongsToMany(models.user, {
    through: models['user-project']
  });
  models.project.hasMany(models.milestone);

  models.user.belongsToMany(models.project, {
    through: models['user-project']
  });
  models.user.hasMany(models.notification);

  models.notification.belongsTo(models.user);
  models.newsfeed.belongsTo(models.project);

  // Synchronize all the defined model into the actual mySQL database
  // ========================================================================
  return sequelize.sync().then(function () {
    return models;
  }, function (error) {
    return console.log(error);
  });
};