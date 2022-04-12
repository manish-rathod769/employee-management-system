// const {
//   Model,
// } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
<<<<<<< HEAD
=======
  // class Leave extends Model {
  //   /**
  //    * Helper method for defining associations.
  //    * This method is not a part of Sequelize lifecycle.
  //    * The `models/index` file will call this method automatically.
  //    */
  //   // static associate(models) {
  //   //   // define association here
  //   // }
  // }
>>>>>>> edit: model, migration and seeder file syntax changes
  const Leave = sequelize.define('Leave', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    },
    isArchived: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });
<<<<<<< HEAD
  Leave.associate = (models) => {
    Leave.belongsTo(models.Employee, {
      foreignKey: 'employeeId',
    })
  };
=======
  // Leave.associate = function (models) {

  // };
>>>>>>> edit: model, migration and seeder file syntax changes
  return Leave;
};
