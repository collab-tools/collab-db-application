module.exports = function (sequelize, DataTypes) {
  return sequelize.define('user_project', {
    role: DataTypes.STRING,
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
    underscored: true
  });
};
