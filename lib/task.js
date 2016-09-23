'use strict';

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('tasks', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    content: DataTypes.TEXT,
    completed_on: DataTypes.DATE,
    github_id: DataTypes.BIGINT,
    github_number: DataTypes.INTEGER,
    assignee_id: DataTypes.STRING
  }, {
    indexes: [{
      fields: ['content'],
      type: 'FULLTEXT'
    }],
    underscored: true,
    classMethods: {
      isExist: function isExist(id) {
        return this.findById(id).then(function (instance) {
          return instance !== null;
        });
      },
      getTask: function getTask(id) {
        return this.findById(id);
      },
      getTasksByAssignee: function getTasksByAssignee(userId, projectId, range) {
        var where = { assignee_id: userId, created_at: { $gt: range } };
        if (projectId) where.project_id = projectId;
        return this.findAll({ where: where });
      },
      getTasksByProject: function getTasksByProject(projectId, range) {
        var where = { projectId: projectId };
        if (range) where.created_at = { $gt: range };
        return this.findAll({ where: where });
      },
      getTasks: function getTasks(range) {
        var where = {};
        if (range) where.created_at = { $gt: range };
        return this.findAll({ where: where });
      },
      getCount: function getCount(range) {
        var where = {};
        if (range) where.created_at = { $gt: range };
        return this.count({ where: where });
      }
    }
  });
};