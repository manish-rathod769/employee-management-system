import express from 'express';
import employee from '../controllers/employee/employee.controller';

const router = express.Router();

router.post('/employees', employee.addEmployee);
router.get('/employees', );
router.get('/employees/:employeeId', );
router.put('/employees/:employeeId', );
router.delete('/employees/:employeeId', );
router.get('/employees/search', );

router.post('/employees/login' );
router.patch('/employees/:employeeId', );

module.exports = router;