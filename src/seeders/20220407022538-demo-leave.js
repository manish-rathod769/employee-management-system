/* eslint-disable no-unused-vars */
import { v4 as uuidv4 } from 'uuid';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'Leaves', [{
      id: uuidv4(),
      employeeId: 'employee001',
      startDate: '2022-05-13',
      endDate: '2022-05-15',
      status: 'pending',
      remainingLeave: '13 days',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      id: uuidv4(),
      employeeId: 'employee002',
      startDate: '2022-05-13',
      endDate: '2022-05-15',
      status: 'rejected',
      remainingLeave: '13 days',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {},
  ),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Leaves', null, {}),
};
