import express from 'express';
const router = new express.Router();
import { leaveRegisterValidation } from '../controllers/leave/leaveValidator';
import { addLeave, viewLeave, deleteLeave, updateLeave } from '../controllers/leave/leaveController';

router.post('/add/leave',leaveRegisterValidation, addLeave );
router.get('/view/leave', viewLeave);
router.get('/view/leave/:id', viewLeave);
router.patch('/update/leave/:id', updateLeave);
router.delete('/delete/leave/:id', deleteLeave);

module.exports = router;