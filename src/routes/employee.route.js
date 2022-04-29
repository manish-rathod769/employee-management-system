import express from 'express';
import * as employeeController from '../controllers/employee/employee.controller';
import * as employeeValidator from '../controllers/employee/employee.validator';
import { getPoc, renderPocView, addPoc, updatePoc } from '../controllers/setting/poc.controller';
import { upload, uploadUpdateAvatar } from '../helpers/index';
import { verifyCookie, checkAJAX } from '../middlewares/auth';
import * as roleCheck from '../middlewares/role';

const router = express.Router();

router.get('/', verifyCookie, roleCheck.roleAdminPmHr(true), employeeController.renderEmployeeView);
// router.get('/', employeeController.renderEmployeeView);
// router.get('/add-employee', verifyCookie, roleCheck.roleAdmin, employeeController.renderAddEmployeeView);

router.post('/employees', verifyCookie, roleCheck.roleAdmin(false), upload.single('avatar'), employeeValidator.employeeValidate, employeeController.addEmployee);
// router.post('/employees', upload.single('avatar'), employeeValidator.employeeValidate, employeeController.addEmployee);
// router.get('/employees', employeeController.getEmployee);
router.get('/employees', checkAJAX, verifyCookie, roleCheck.roleAdminPmHr(false), employeeController.getEmployee);
router.get('/employees/:employeeId', checkAJAX, verifyCookie, employeeController.getEmployeeOne);
router.put('/employees/:employeeId', verifyCookie, roleCheck.roleAdmin(false), uploadUpdateAvatar.single('avatarUpdate'), employeeValidator.employeeValidate, employeeController.updateEmployee);
router.delete('/employees', verifyCookie, roleCheck.roleAdmin(false), employeeController.deleteEmployee);
// router.get('/employees/search', );

router.get('/login', employeeController.loginView);
router.post('/login', employeeValidator.loginValidate, employeeController.loginEmployee);
router.get('/forgot-password', employeeController.forgotPasswordView);
router.post('/forgot-password', employeeController.forgotPassword);
// router.patch('/employees/:employeeId', );
router.get('/employee/:employeeId', verifyCookie, roleCheck.roleDEV(true), employeeController.renderEmployee);
router.get('/employee/:employeeId/change-password', verifyCookie, employeeController.changePasswordView);
router.post('/employee/:employeeId/change-password', verifyCookie, employeeValidator.passwordValidate, employeeController.changePassword);
// protected, check for employee login and empoyee side route
router.get('/profile', verifyCookie, roleCheck.roleAdminPmHr(true), employeeController.renderEmployeeProfile);


// general settings-route
// router.get('/technologies', employeeController.getTechnology);
router.get('/technologies', checkAJAX, verifyCookie, roleCheck.roleAdminPmHr(false), employeeController.getTechnology);
router.post('/technologies', verifyCookie, roleCheck.roleAdmin(false), employeeController.addTechnology);
router.get('/setting', verifyCookie, roleCheck.roleAdminPmHr(true), employeeController.settingView);
router.get('/logout', verifyCookie, employeeController.logOut);

router.get('/employee/:employeeId/poc', verifyCookie, roleCheck.roleDEV(true), renderPocView);
router.get('/poc', checkAJAX, verifyCookie, roleCheck.roleAll(false), getPoc); // for perticular Employee POC dynaminc(possibility)
router.post('/poc', verifyCookie, roleCheck.roleAdmin(false), addPoc);
router.put('/poc', verifyCookie, roleCheck.roleAdmin(false), updatePoc);
module.exports = router;
