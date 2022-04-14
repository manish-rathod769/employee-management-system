import express from 'express';

import * as leaveValidator from '../controllers/leave/leave.validator';

import * as leaveControlller from '../controllers/leave/leave.controller';
import { verifyCookie } from '../middlewares/auth';
import * as roleCheck from '../middlewares/role';

const router = express.Router();

// developer

<<<<<<< HEAD
router.get('/leave/add-view',verifyCookie, roleCheck.roleDEV(true) ,leaveControlller.leaveForm);
router.post('/leave/add',verifyCookie, roleCheck.roleDEV(false) , leaveValidator.leaveRegisterValidation, leaveControlller.addLeave);
router.get('/leave/view',verifyCookie, roleCheck.role_All(false) ,leaveControlller.viewLeave);
router.get('/leave/view/:id',verifyCookie, roleCheck.role_All(false) ,leaveControlller.viewOneLeave);
router.post('/leave/update/:id',verifyCookie, roleCheck.roleDEV(false) ,leaveValidator.leaveUpdateValidation, leaveControlller.updateLeave);

// pm
router.put('/leave/accept-reject',verifyCookie, roleCheck.rolePM(false), leaveControlller.acceptRejectLeave);
=======
router.get('/leave/add-view', leaveControlller.leaveForm);
router.post('/leave/add', leaveValidator.leaveRegisterValidation, leaveControlller.addLeave);
router.get('/leave/view', leaveControlller.viewLeave);
router.get('/leave/view/:id', leaveControlller.viewOneLeave);
router.post('/leave/update/:id', leaveValidator.leaveUpdateValidation, leaveControlller.updateLeave);

// pm
router.put('/leave/accept-reject', leaveControlller.acceptRejectLeave);
>>>>>>> add: pagination in all view leave page.

module.exports = router;
