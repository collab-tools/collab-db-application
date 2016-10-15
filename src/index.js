import fs from 'fs';
import winston from 'winston';
import winstonRotate from 'winston-daily-rotate-file';
import Sequelize from 'sequelize';

// Setup logger to log connections and queries send to the database
// ========================================================================
function setupLogger(logDir) {
  // configure logger to use as default error handler
  const tsFormat = () => (new Date()).toLocaleTimeString();
  if (!fs.existsSync(logDir)) { fs.mkdirSync(logDir); }
  winston.remove(winston.transports.Console);

  // default transport for console with timestamp and color coding
  winston.add(winston.transports.Console, {
    prettyPrint: true,
    timestamp: tsFormat,
    colorize: true,
    level: 'debug'
  });

  // file transport for debug messages
  winston.add(winstonRotate, {
    name: 'debug-transport',
    filename: `${logDir}/debug.log`,
    timestamp: tsFormat,
    level: 'debug'
  });

  winston.info('Database debugging initialized.');
}

// Setup Sequelize and Connection with Database
// ======================================================
export default (config) => {
  const dbName = config.name;
  const dbUsername = config.username;
  const dbPassword = config.password;
  const dbOptions = config.options;

  // If logging configuration is found, evaluate and setup logger if needed
  if (config.logging) { setupLogger(config.logging); }

  const models = {};
  const sequelize = new Sequelize(dbName, dbUsername, dbPassword, dbOptions);
  models.sequelize = sequelize;

  const modelFiles = [
    'milestone', 'task', 'user', 'project', 'user-project',
    'notification', 'newsfeed'
  ];

  modelFiles.forEach((model) => {
    models[model.replace('-', '_')] = sequelize.import(`${__dirname}/${model}`);
  });

  // Setup relations and associations between models based on database design
  // ========================================================================
  models.task.belongsTo(models.milestone, {
    foreignKey: {
      name: 'milestoneId',
      field: 'milestone_id'
    }
  });

  models.task.belongsTo(models.project, {
    foreignKey: {
      name: 'projectId',
      field: 'project_id'
    }
  });

  models.milestone.belongsTo(models.project, {
    foreignKey: {
      name: 'projectId',
      field: 'project_id'
    }
  });

  models.milestone.hasMany(models.task, {
    foreignKey: {
      name: 'milestoneId',
      field: 'milestone_id'
    }
  });

  models.project.belongsToMany(models.user, {
    through: models.user_project,
    foreignKey: {
      name: 'userId',
      field: 'user_id'
    }
  });

  models.project.hasMany(models.milestone, {
    foreignKey: {
      name: 'projectId',
      field: 'project_id'
    }
  });

  models.user.belongsToMany(models.project, {
    through: models.user_project,
    foreignKey: {
      name: 'projectId',
      field: 'project_id'
    }
  });

  models.user.hasMany(models.notification, {
    foreignKey: {
      name: 'userId',
      field: 'user_id'
    }
  });

  models.notification.belongsTo(models.user, {
    foreignKey: {
      name: 'userId',
      field: 'user_id'
    }
  });

  models.newsfeed.belongsTo(models.project, {
    foreignKey: {
      name: 'projectId',
      field: 'project_id'
    }
  });


  // Synchronize all the defined model into the actual mySQL database
  // ========================================================================
  sequelize.sync().catch(config.logging ? winston.error : console.error);

  return models;
};
