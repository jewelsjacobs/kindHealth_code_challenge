'use strict';
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('event', {
    date: DataTypes.DATE,
    user: DataTypes.STRING,
    type: DataTypes.STRING,
    message: DataTypes.STRING,
    otheruser: DataTypes.STRING
  }, {
    timestamps: false
  });
  return Event;
};
