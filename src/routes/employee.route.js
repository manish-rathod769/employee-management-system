import express from 'express';
import * as employeeController from '../controllers/employee/employee.controller';
import * as employeeValidator from '../controllers/employee/employee.validator';

const router = express.Router();

router.get('/', employeeController.renderEmployeeView);
router.get('/add-employee', employeeController.renderAddEmployeeView);

router.post('/employees', employeeValidator.employeeValidate, employeeController.addEmployee);
router.get('/employees', employeeController.getEmployee);
router.get('/employees/:employeeId', );
router.put('/employees/:employeeId', );
router.delete('/employees/:employeeId', );
router.get('/employees/search', );

router.post('/employees/login' );
router.patch('/employees/:employeeId', );

module.exports = router;