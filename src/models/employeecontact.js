'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EmployeeContact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      EmployeeContact.belongsTo(models.Employee, {
        foreignKey: 'employeeId',
        onDelete: 'CASCADE',
      });
    }
  }
  EmployeeContact.init({
    contactNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    secondaryEmail: {
      type: DataTypes.STRING,
    },
    employeeId: {
      type: DataTypes.UUID,
    },
    houseNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    addressLine1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    addressLine2: {
      type: DataTypes.STRING,
    },
    landmark: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pincode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'EmployeeContact',
  });
  return EmployeeContact;
};