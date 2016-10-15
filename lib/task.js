'use strict';

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('tasks', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    content: DataTypes.TEXT,
    completedOn: {
      type: DataTypes.DATE,
      field: 'completed_on'
    },
    githubId: {
      type: DataTypes.BIGINT,
      field: 'github_id'
    },
    githubNumber: {
      type: DataTypes.INTEGER,
      field: 'github_number'
    },
    assigneeId: {
      type: DataTypes.STRING,
      field: 'assignee_id'
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at'
    }
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
        var where = { assigneeId: userId, createdAt: { $gt: range } };
        if (projectId) where.projectId = projectId;
        return this.findAll({ where: where });
      },
      getTasksByProject: function getTasksByProject(projectId, range) {
        var where = { projectId: projectId };
        if (range) where.createdAt = { $gt: range };
        return this.findAll({ where: where });
      },
      getTasks: function getTasks(range) {
        var where = {};
        if (range) where.createdAt = { $gt: range };
        return this.findAll({ where: where });
      },
      getCount: function getCount(range) {
        var where = {};
        if (range) where.createdAt = { $gt: range };
        return this.count({ where: where });
      }
    }
  });
};