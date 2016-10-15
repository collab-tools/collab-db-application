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
      getUsers(range) {
        const where = {};
        if (range) where.createdAt = { $gt: range };
        return this.findAll({ where });
      },
      getUsersCount() {
        return this.count();
      },
      getUserProject(id) {
        return this.findAll({
          where: { id },
          include: [{
            model: this.associations.projects.target
          }]
        });
      }
    }
  });
};
