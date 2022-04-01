'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EmployeeAcademic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      EmployeeAcademic.belongsTo(models.Employee, {
        foreignKey: 'employeeId',
        onDelete: 'CASCADE',
      });
    }
  }
  EmployeeAcademic.init({
    employeeId: {
      type: DataTypes.UUID,
    },
    highestQualification: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    collage: {
      type: DataTypes.STRING,
      allowNull: false
    },
    university: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    knownTech: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
  }, {
    sequelize,
    modelName: 'EmployeeAcademic',
  });
  return EmployeeAcademic;
};