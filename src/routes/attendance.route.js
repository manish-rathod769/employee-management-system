import express from 'express';
import * as attendance from '../controllers/attendance/attendance.controller';

const router = express.Router();

router.get('/employee/:employeeId/attendance', attendance.getAttendanceView);
router.post('/employee/:employeeId/attendance', attendance.addAttendance);
router.get('/employee/:employeeId/attendance/table', attendance.getAttendance);

module.exports = router;
