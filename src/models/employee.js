import { Op } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define(
    'Employee',
    {
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
      avatar: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      verifyToken: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      isArchive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      idDefaultPassword: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      joiningDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      knownTech: {
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
      careerStartDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      defaultScope: {
        where: { isArchive: false },
        attributes: { exclude: ['password', 'verifyToken', 'role'] },
      },
      scopes: {
        admin: {
          where: { isArchive: false },
          attributes: { exclude: ['password', 'verifyToken'] },
        },
        pm: {
          where: { 
            [Op.and]: [
              { isArchive: false }, 
              { role: {
                  [Op.or]: ["PM", "DEV"], 
                }
              },
            ]},
          attributes: { exclude: ['password', 'verifyToken']},
        },
        login: {
          attributes: { include: ['password', 'verifyToken'] },
        },
      },
    },
  );
  Employee.associate = (models) => {
    Employee.hasOne(models.EmployeeContact, {
      foreignKey: 'employeeId',
    });
    Employee.hasOne(models.EmployeeAcademic, {
      foreignKey: 'employeeId',
    });
    Employee.hasOne(models.EmployeePreWork, {
      foreignKey: 'employeeId',
    });
    Employee.hasMany(models.ProjectEmployee, {
      foreignKey: 'employeeId',
    });
    Employee.hasMany(models.Poc, {
      foreignKey: 'employeeId',
    });
    Employee.belongsToMany(models.Technology, {
      through: 'EmployeeTech',
      foreignKey: 'employeeId',
      uniqueKey: 'empTech'
    });
    Employee.hasMany(models.Leave, {
      foreignKey: 'employeeId',
    });
  };
  return Employee;
};
