'use strict';

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('milestones', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    content: DataTypes.TEXT,
    deadline: DataTypes.DATE,
    githubId: {
      type: DataTypes.BIGINT,
      field: 'github_id'
    },
    githubNumber: {
      type: DataTypes.INTEGER,
      field: 'github_number'
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
    timestamp: true,
    underscored: true,
    classMethods: {
      isExist: function isExist(id) {
        return this.findById(id).then(function (instance) {
          return instance !== null;
        });
      },
      getMilestone: function getMilestone(id) {
        return this.findById(id);
      },
      getMilestonesByProject: function getMilestonesByProject(projectId, range) {
        var where = { projectId: projectId };
        if (range) where.createdAt = { $gt: range };
        return this.findAll({ where: where });
      },
      getMilestones: function getMilestones(range) {
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