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
      isExist(id) {
        return this.findById(id).then(instance => instance !== null);
      },
      getMilestone(id) {
        return this.findById(id);
      },
      getMilestonesByProject(projectId, range) {
        const where = { projectId };
        if (range) where.createdAt = { $gt: range };
        return this.findAll({ where });
      },
      getMilestones(range) {
        const where = {};
        if (range) where.createdAt = { $gt: range };
        return this.findAll({ where });
      },
      getCount(range) {
        const where = {};
        if (range) where.createdAt = { $gt: range };
        return this.count({ where });
      }
    }
  });
};
