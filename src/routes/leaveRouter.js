import express from 'express';

import * as leaveValidator from '../controllers/leave/leaveValidator';

import * as leaveControlller from '../controllers/leave/leaveController';

const router = new express.Router();


// developer
router.post('/add/leave', leaveValidator.leaveRegisterValidation, leaveControlller.addLeave);
// router.get('/add/leave',addLeaveView);
router.get('/view/leave', leaveControlller.viewLeave);
router.get('/view/leave/:id', leaveControlller.viewOwnLeave);
router.post('/update/leave/:id', leaveValidator.leaveUpdateValidation, leaveControlller.updateLeave);
router.get('/delete/leave/:id', leaveControlller.deleteLeave);

router.get('/', leaveControlller.leaveForm);


// pm
router.get('/view/leaves', leaveControlller.viewLeaves);
router.get('/accept/leaves/:id', leaveControlller.acceptLeaves);
router.get('/reject/leaves/:id', leaveControlller.rejectLeaves);

// admin
router.get('/view/oneLeave/:id', leaveControlller.adminViewLeave);
router.get('/view/allLeave', leaveControlller.adminViewLeave);

module.exports = router;
