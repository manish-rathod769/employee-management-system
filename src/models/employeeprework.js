'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EmployeePreWork extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      EmployeePreWork.belongsTo(models.Employee, {
        foreignKey: 'employeeId',
        onDelete: 'CASCADE',
      });
    }
  }
  EmployeePreWork.init({
    employeeId: {
      type: DataTypes.UUID,
    },
    previousEmployer: {
      type: DataTypes.STRING,
    },
    employerAddress: {
      type: DataTypes.STRING,
    },
    workingTime: {
      type: DataTypes.STRING,
    },  
  }, {
    sequelize,
    modelName: 'EmployeePreWork',
  });
  return EmployeePreWork;
};