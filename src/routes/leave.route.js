import express from 'express';

import * as leaveValidator from '../controllers/leave/leave.validator';

import * as leaveControlller from '../controllers/leave/leave.controller';

const router = new express.Router();


// developer
router.get('/', leaveControlller.leaveForm);
router.post('/add/leave', leaveValidator.leaveRegisterValidation, leaveControlller.addLeave);
router.get('/view/leave', leaveControlller.viewLeave);
router.get('/view/leave/:id', leaveControlller.viewOneLeave);
router.post('/update/leave/:id', leaveValidator.leaveUpdateValidation, leaveControlller.updateLeave);


// pm
router.get('/accept/leaves/:id', leaveControlller.acceptLeaves);
router.get('/reject/leaves/:id', leaveControlller.rejectLeaves);

module.exports = router;
