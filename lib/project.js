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
            model: this.associations.users.target
          }]
        });
      },
      getUsersOfProject: function getUsersOfProject(id) {
        return this.findById(id).then(function (project) {
          if (!project) return null;
          return project.getUsers();
        });
      },
      getProjects: function getProjects(start, end) {
        var where = {};
        where.createdAt = { $between: [start, end] };
        return this.findAll({ where: where });
      },
      getProjectsWithMembers: function getProjectsWithMembers(start, end) {
        var where = {};
        where.createdAt = { $between: [start, end] };
        return this.findAll({
          where: where,
          include: [{
            model: this.associations.users.target
          }]
        });
      },
      getProjectsCount: function getProjectsCount(start, end) {
        var where = {};
        where.createdAt = { $between: [start, end] };
        return this.count({ where: where });
      },
      getRepositories: function getRepositories(start, end) {
        var where = { githubRepoName: { $not: null }, githubRepoOwner: { $not: null } };
        where.createdAt = { $between: [start, end] };
        return this.findAll({
          where: where,
          attributes: [['id', 'projectId'], 'githubRepoName', 'githubRepoOwner']
        });
      },
      getRepositoriesCount: function getRepositoriesCount(start, end) {
        var where = { githubRepoName: { $not: null }, githubRepoOwner: { $not: null } };
        where.createdAt = { $between: [start, end] };
        return this.count({ where: where });
      }
    }
  });
};