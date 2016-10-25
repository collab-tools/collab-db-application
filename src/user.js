module.exports = function (sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    googleId: {
      type: DataTypes.STRING,
      field: 'google_id'
    },
    email: DataTypes.STRING,
    githubLogin: {
      type: DataTypes.STRING,
      field: 'github_login'
    },
    displayName: {
      type: DataTypes.STRING,
      field: 'display_name'
    },
    displayImage: {
      type: DataTypes.STRING,
      field: 'display_image'
    },
    googleRefreshToken: {
      type: DataTypes.STRING,
      field: 'google_refresh_token'
    },
    githubRefreshToken: {
      type: DataTypes.STRING,
      field: 'github_refresh_token'
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
      isExist(email) {
        return this.find({
          where: { email }
        }).then(instance => instance !== null);
      },
      getUserById(id) {
        return this.findById(id);
      },
      getUsers(start, end) {
        const where = {};
        where.createdAt = { $between: [start, end] };
        return this.findAll({ where });
      },
      getUsersWithProjects(start, end) {
        const where = {};
        where.createdAt = { $between: [start, end] };
        return this.findAll({
          where,
          include: [{
            model: this.associations.projects.target
          }]
        });
      },
      getUserWithProjects(id) {
        const where = { id };
        return this.findAll({
          where,
          include: [{
            model: this.associations.projects.target
          }]
        });
      },
      getUsersCount() {
        return this.count();
      },
      getUserProjects(id) {
        return this.findById(id).then((user) => {
          if (!user) return null;
          return user.getProjects();
        });
      },
    }
  });
};
