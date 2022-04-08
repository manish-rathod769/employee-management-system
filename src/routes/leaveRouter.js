import express from 'express';
const router = new express.Router();
import { leaveRegisterValidation, leaveUpdateValidation } from '../controllers/leave/leaveValidator';
import { addLeave, viewLeave, deleteLeave, updateLeave, leaveForm } from '../controllers/leave/leaveController';

router.post('/add/leave',leaveRegisterValidation, addLeave );
router.get('/view/leave', viewLeave);
router.get('/view/leave/:id', viewLeave);
router.patch('/update/leave/:id',leaveUpdateValidation, updateLeave);
router.delete('/delete/leave/:id', deleteLeave);

router.get('/',leaveForm);


module.exports = router;