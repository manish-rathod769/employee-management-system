module.exports = (sequelize, DataTypes) => {
    const Leave = sequelize.define(
      'Leave',
      {       
        
        employeeId: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        startDate: {
          type: DataTypes.STRING,
        },
        endDate: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        reason: {
          type: DataTypes.STRING,
        },
        status: {
          type: DataTypes.STRING,
        },
        remainingLeave: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        isArchieve: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        defaultScope: {
          attributes: { exclude: ['password', 'verifyToken', 'isAdmin'] },
        },
        scopes: {
          withSecretColumns: {
            attributes: { include: ['password', 'verifyToken', 'isAdmin'] },
          },
        },
      },
    );
    Leave.associate = function (models) {
      // associations can be defined here
    };
    return Leave;
  };
  