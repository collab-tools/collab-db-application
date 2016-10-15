'use strict';

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('newsfeed', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    data: DataTypes.STRING,
    template: DataTypes.STRING,
    source: DataTypes.STRING,
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