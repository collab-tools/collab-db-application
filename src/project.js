module.exports = function (sequelize, DataTypes) {
  return sequelize.define('projects', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    content: DataTypes.TEXT,
    rootFolder: {
      type: DataTypes.STRING,
      field: 'root_folder'
    },
    chatroom: DataTypes.STRING,
    githubRepoName: {
      type: DataTypes.STRING,
      field: 'github_repo_name'
    },
    githubRepoOwner: {
      type: DataTypes.STRING,
      field: 'github_repo_owner'
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
    timestamp: true,
    underscored: true,
    classMethods: {
      findProjectById(id) {
        return this.findById(id);
      },
      getProjectWithMembers(id) {
        const where = { id };
        return this.findAll({
          where,
          include: [{
            model: this.associations.user.target
          }]
        });
      },
      getUsersOfProject(id) {
        return this.findById(id)
          .then((project) => {
            if (!project) return null;
            return project.getUsers();
          });
      },
      getProjects(range) {
        const where = {};
        if (range) where.createdAt = { $gt: range };
        return this.findAll({ where });
      },
      getProjectsWithMembers(range) {
        const where = {};
        if (range) where.createdAt = { $gt: range };
        return this.findAll({
          where,
          include: [{
            model: this.associations.user.target
          }]
        });
      },
      getProjectsCount(range) {
        const where = {};
        if (range) where.createdAt = { $gt: range };
        return this.count({ where });
      },
      getRepositories(range) {
        const where = { githubRepoName: { $not: null }, githubRepoOwner: { $not: null } };
        if (range) where.createdAt = { $gt: range };
        return this.findAll({
          where,
          attributes: ['githubRepoName', 'githubRepoOwner']
        });
      },
      getRepositoriesCount(range) {
        const where = { githubRepoName: { $not: null }, githubRepoOwner: { $not: null } };
        if (range) where.createdAt = { $gt: range };
        return this.count({ where });
      }
    }
  });
};
