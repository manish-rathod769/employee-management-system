'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Employee.hasOne(models.EmployeeContact, {
        foreignKey: 'employeeId',
      });
      Employee.hasOne(models.EmployeeAcademic, {
        foreignKey: 'employeeId',
      });
      Employee.hasOne(models.EmployeePreWork, {
        foreignKey: 'employeeId',
      });
    }
  };
  Employee.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    firstName: { 
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: { 
      type: DataTypes.STRING,
      allowNull: false,
    },
    middleName: { 
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: { 
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: { 
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: { 
      type: DataTypes.ENUM('male', 'female'),
      allowNull: false,
    },
    role: { 
      type: DataTypes.ENUM('ADMIN', 'PM', 'HR', 'DEV'),
      allowNull: false,
    },
    DOB: { 
      type: DataTypes.DATE,
      allowNull: false,
    },
    verifyToken: { 
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    isArchive: { 
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    joiningDate: { 
      type: DataTypes.DATE,
      allowNull: false,
    },
    totalExp: { 
      type: DataTypes.DECIMAL,
      allowNull: false,
    }  
  },
  {
    defaultScope:{
      where: { isArchive: false },
      attributes: { exclude: ['password', 'verifyToken', 'role'] },
    },
    sequelize,
    modelName: 'Employee',
  });
  return Employee;
};
