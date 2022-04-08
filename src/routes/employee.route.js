import express from 'express';
import * as employeeController from '../controllers/employee/employee.controller';
import * as employeeValidator from '../controllers/employee/employee.validator';

const router = express.Router();

router.get('/', employeeController.renderEmployeeView);
router.get('/add-employee', employeeController.renderAddEmployeeView);

router.post('/employees', employeeValidator.employeeValidate, employeeController.addEmployee);
router.get('/employees', employeeController.getEmployee);
router.get('/employees/:employeeId', employeeController.getEmployeeOne);
router.put('/employees/:employeeId', employeeValidator.employeeValidate, employeeController.updateEmployee);
router.delete('/employees', employeeController.deleteEmployee);
router.get('/employees/search', );

router.get('/login', employeeController.loginView);
router.post('/login', employeeValidator.loginValidate, employeeController.loginEmployee);
router.patch('/employees/:employeeId', );
router.get('/employee/:employeeId', employeeController.renderEmployee);
// protected, check for employee login and empoyee side route
router.get('/profile', employeeController.renderEmployeeProfile);


// general settings-route
router.get('/technologies', employeeController.getTechnology);
router.post('/technologies', employeeController.addTechnology);
router.get('/setting', employeeController.settingView);

module.exports = router;
