"use strict";

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "users",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      googleId: {
        type: DataTypes.STRING,
        field: "google_id"
      },
      email: DataTypes.STRING,
      githubLogin: {
        type: DataTypes.STRING,
        field: "github_login"
      },
      displayName: {
        type: DataTypes.STRING,
        field: "display_name"
      },
      displayImage: {
        type: DataTypes.STRING,
        field: "display_image"
      },
      googleRefreshToken: {
        type: DataTypes.STRING,
        field: "google_refresh_token"
      },
      githubRefreshToken: {
        type: DataTypes.STRING,
        field: "github_refresh_token"
      },
      createdAt: {
        type: DataTypes.DATE,
        field: "created_at"
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: "updated_at"
      }
    },
    {
      timestamp: true,
      underscored: true,
      classMethods: {
        isExist: function isExist(email) {
          return this.find({
            where: { email: email }
          }).then(function(instance) {
            return instance !== null;
          });
        },
        getUserByEmail: function getUserByEmail(email) {
          var where = { email: email };
          return this.findOne({ where: where });
        },
        getUserRolesByEmail: function getUserRolesByEmail(email) {
          var where = { email: email };
          return this.findOne({
            where: where,
            attributes: ["email"],
            include: [
              {
                model: this.associations.user_projects.target,
                attributes: ["role"]
              }
            ]
          });
        },
        getUserById: function getUserById(id) {
          return this.findById(id);
        },
        getUsers: function getUsers(start, end) {
          var where = {};
          where.createdAt = { $between: [start, end] };
          return this.findAll({ where: where });
        },
        getUsersWithProjects: function getUsersWithProjects(start, end) {
          var where = {};
          where.createdAt = { $between: [start, end] };
          return this.findAll({
            where: where,
            include: [
              {
                model: this.associations.projects.target
              }
            ]
          });
        },
        getUserWithProjects: function getUserWithProjects(id) {
          var where = { id: id };
          return this.findAll({
            where: where,
            include: [
              {
                model: this.associations.projects.target
              }
            ]
          });
        },
        getUsersCount: function getUsersCount() {
          return this.count();
        },
        getUserProjects: function getUserProjects(id) {
          return this.findById(id).then(function(user) {
            if (!user) return null;
            return user.getProjects();
          });
        }
      }
    }
  );
};
