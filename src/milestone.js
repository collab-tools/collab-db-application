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
      getMilestonesByProject(projectId, start, end) {
        const where = { projectId };
        where.createdAt = { $between: [start, end] };
        return this.findAll({
          where,
          include: [{
            model: this.associations.tasks.target,
            required: true
          }]
        });
      },
      getMilestones(start, end) {
        const where = {};
        where.createdAt = { $between: [start, end] };
        return this.findAll({
          where,
          include: [{
            model: this.associations.tasks.target,
            required: true
          }]
        });
      },
      getElapsedMilestones(start, end) {
        const where = {};
        where.deadline = { $between: [start, end] };
        return this.findAll({
          where,
          include: [{
            model: this.associations.tasks.target,
            required: true
          }]
        });
      },
      getElapsedMilestonesByProject(projectId, start, end) {
        const where = { projectId };
        where.deadline = { $between: [start, end] };
        return this.findAll({
          where,
          include: [{
            model: this.associations.tasks.target,
            required: true
          }]
        });
      },
      getCount(start, end) {
        const where = {};
        where.createdAt = { $between: [start, end] };
        return this.count({ where });
      }
    }
  });
};
