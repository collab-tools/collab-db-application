'use strict';

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('newsfeed', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    data: DataTypes.STRING,
    template: DataTypes.STRING,
    source: DataTypes.STRING
  }, {
    underscored: true
  });
};