'use strict';

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('milestones', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    content: DataTypes.TEXT,
    deadline: DataTypes.DATE,
    github_id: DataTypes.BIGINT,
    github_number: DataTypes.INTEGER
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
      getMilestone: function getMilestone(id) {
        return this.findById(id);
      },
      getMilestonesByProject: function getMilestonesByProject(projectId, range) {
        var where = { projectId: projectId };
        if (range) where.created_at = { $gt: range };
        return this.findAll({ where: where });
      },
      getMilestones: function getMilestones(range) {
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