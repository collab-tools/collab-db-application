const Sequelize = require('sequelize');

// Setup Sequelize and Connection with Database
// ======================================================
export default (config) => {
  const dbName = config('name');
  const dbUsername = config('username');
  const dbPassword = config('password');
  const dbOptions = config('options');

  const models = {};
  const sequelize = new Sequelize(dbName, dbUsername, dbPassword, dbOptions);
  models.sequelize = sequelize;

  const modelFiles = [
    'milestone',
    'task',
    'user',
    'project',
    'user-project',
    'notification',
    'newsfeed'
  ];

  modelFiles.forEach(model => {
    models[model] = sequelize.import(`${__dirname}/${model}`);
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
  return sequelize.sync().then(() => {
    return models;
  }, error => {
    return console.log(error);
  });
};
