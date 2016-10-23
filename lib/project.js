'use strict';

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
      findProjectById: function findProjectById(id) {
        return this.findById(id);
      },
      getProjectWithMembers: function getProjectWithMembers(id) {
        var where = { id: id };
        return this.findAll({
          where: where,
          include: [{
            model: this.associations.user.target
          }]
        });
      },
      getUsersOfProject: function getUsersOfProject(id) {
        return this.findById(id).then(function (project) {
          if (!project) return null;
          return project.getUsers();
        });
      },
      getProjects: function getProjects(range) {
        var where = {};
        if (range) where.createdAt = { $gt: range };
        return this.findAll({ where: where });
      },
      getProjectsWithMembers: function getProjectsWithMembers(range) {
        var where = {};
        if (range) where.createdAt = { $gt: range };
        return this.findAll({
          where: where,
          include: [{
            model: this.associations.user.target
          }]
        });
      },
      getProjectsCount: function getProjectsCount(range) {
        var where = {};
        if (range) where.createdAt = { $gt: range };
        return this.count({ where: where });
      },
      getRepositories: function getRepositories(range) {
        var where = { githubRepoName: { $not: null }, githubRepoOwner: { $not: null } };
        if (range) where.createdAt = { $gt: range };
        return this.findAll({
          where: where,
          attributes: [['id', 'projectId'], 'githubRepoName', 'githubRepoOwner']
        });
      },
      getRepositoriesCount: function getRepositoriesCount(range) {
        var where = { githubRepoName: { $not: null }, githubRepoOwner: { $not: null } };
        if (range) where.createdAt = { $gt: range };
        return this.count({ where: where });
      }
    }
  });
};