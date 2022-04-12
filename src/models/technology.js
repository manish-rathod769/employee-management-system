module.exports = (sequelize, DataTypes) => {
  const Technology = sequelize.define(
    'Technology',
    {
      techName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isArchive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
  );
  return Technology;
};
