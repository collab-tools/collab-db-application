'use strict';

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('projects', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    content: DataTypes.TEXT,
    root_folder: DataTypes.STRING,
    chatroom: DataTypes.STRING,
    github_repo_name: DataTypes.STRING,
    github_repo_owner: DataTypes.STRING
  }, {
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
        if (range) where.created_at = { $gt: range };
        return this.findAll({ where: where });
      },
      getProjectsWithMembers: function getProjectsWithMembers(range) {
        var where = {};
        if (range) where.created_at = { $gt: range };
        return this.findAll({
          where: where,
          include: [{
            model: this.associations.user.target
          }]
        });
      },
      getProjectsCount: function getProjectsCount(range) {
        var where = {};
        if (range) where.created_at = { $gt: range };
        return this.count({ where: where });
      },
      getRepositories: function getRepositories(range) {
        var where = { github_repo_name: { $not: null }, github_repo_owner: { $not: null } };
        if (range) where.created_at = { $gt: range };
        return this.findAll({
          where: where,
          attributes: ['github_repo_name', 'github_repo_owner']
        });
      },
      getRepositoriesCount: function getRepositoriesCount(range) {
        var where = { github_repo_name: { $not: null }, github_repo_owner: { $not: null } };
        if (range) where.created_at = { $gt: range };
        return this.count({ where: where });
      }
    }
  });
};