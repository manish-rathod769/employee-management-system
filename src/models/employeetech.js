module.exports = (sequelize, DataTypes) => {
  const EmployeeTech = sequelize.define(
    'EmployeeTech',
    {},
    { timestamps: false },
    );
    
  return EmployeeTech;
};