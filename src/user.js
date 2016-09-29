module.exports = function (sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    google_id: DataTypes.STRING,
    email: DataTypes.STRING,
    github_login: DataTypes.STRING,
    display_name: DataTypes.STRING,
    display_image: DataTypes.STRING,
    google_refresh_token: DataTypes.STRING,
    github_refresh_token: DataTypes.STRING
  }, {
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
      getUsers() {
        return this.findAll();
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
