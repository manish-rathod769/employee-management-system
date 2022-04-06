import express from 'express';
import * as employeeController from '../controllers/employee/employee.controller';
import * as employeeValidator from '../controllers/employee/employee.validator';

const router = express.Router();

router.get('/', employeeController.renderEmployeeView);
router.get('/add-employee', employeeController.renderAddEmployeeView);

router.post('/employees', employeeValidator.employeeValidate, employeeController.addEmployee);
router.get('/employees', employeeController.getEmployee);
router.get('/employees/:employeeId', employeeController.getEmployeeOne);
router.put('/employees/:employeeId', );
router.delete('/employees', employeeController.deleteEmployee);
router.get('/employees/search', );

router.post('/employees/login' );
router.patch('/employees/:employeeId', );

// protected, check for employee login and empoyee side route
router.get('/profile', employeeController.renderEmployeeProfile);
module.exports = router;