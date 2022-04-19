import express from 'express';

import * as leaveValidator from '../controllers/leave/leave.validator';

import * as leaveControlller from '../controllers/leave/leave.controller';

const router = new express.Router();

// developer

router.get('/leave/add-view', leaveControlller.leaveForm);
router.post('/leave/add', leaveValidator.leaveRegisterValidation, leaveControlller.addLeave);
router.get('/leave/view', leaveControlller.viewLeave);
router.get('/leave/view/:id', leaveControlller.viewOneLeave);
router.post('/leave/update/:id', leaveValidator.leaveUpdateValidation, leaveControlller.updateLeave);

// pm
router.put('/leave/accept-reject', leaveControlller.acceptRejectLeave);

module.exports = router;
