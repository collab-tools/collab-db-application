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
      isExist(id) {
        return this.findById(id).then(instance => instance !== null);
      },
      getTask(id) {
        return this.findById(id);
      },
      getTasksByAssignee(userId, projectId, range) {
        const where = { assignee_id: userId, created_at: { $gt: range } };
        if (projectId) where.projectId = projectId;
        return this.findAll({ where });
      },
      getTasksByProject(projectId, range) {
        const where = { projectId };
        if (range) where.createdAt = { $gt: range };
        return this.findAll({ where });
      },
      getTasks(range) {
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
