module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Employees', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      firstName: {
        type: Sequelize.STRING,
      },
      lastName: {
        type: Sequelize.STRING,
      },
      middleName: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      gender: {
        type: Sequelize.ENUM('male', 'female'),
      },
      role: {
        type: Sequelize.ENUM('ADMIN', 'PM', 'HR', 'DEV'),
      },
      DOB: {
        type: Sequelize.DATE,
      },
      avatar: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      verifyToken: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      isArchive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      joiningDate: {
        type: Sequelize.DATE,
      },
      careerStartDate: {
        type: Sequelize.DATE,
      },
      idDefaultPassword: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      knownTech: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Employees');
  },
};
