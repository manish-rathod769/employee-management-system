import express from 'express';

import * as leaveValidator from '../controllers/leave/leave.validator';

import * as leaveControlller from '../controllers/leave/leave.controller';
import { verifyCookie } from '../middlewares/auth';
import * as roleCheck from '../middlewares/role';

<<<<<<< HEAD
const router = express.Router();
=======
const router = new express.Router();
>>>>>>> edit: accept-reject route combined

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
// pm
router.put('/accept-reject/leave', leaveControlller.acceptRejectLeave);
>>>>>>> edit: accept-reject route combined

module.exports = router;
