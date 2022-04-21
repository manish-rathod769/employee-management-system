import express from 'express';
import { clientRegisterValidation, clientUpdateDataValidation } from '../controllers/client/client.validator';
import * as clientControllers from '../controllers/client/client.controller';
import verifyCookie from '../middlewares/auth';
import * as roleCheck from '../middlewares/role';

const route = express.Router();

route.get('/clients', verifyCookie, roleCheck.role_Admin_PM_HR(true), (req, res) => res.render('clients'));
route.get('/getClients', verifyCookie, roleCheck.role_Admin_PM_HR(false), clientControllers.getAllClient);
route.get('/clients/:clientId', verifyCookie, roleCheck.role_Admin_PM_HR(false), clientControllers.getOneClient);
route.post('/clients', verifyCookie, roleCheck.roleAdmin(false), clientRegisterValidation, clientControllers.addNewClient);
route.put('/clients/:clientId', verifyCookie, roleCheck.roleAdmin(false), clientUpdateDataValidation, clientControllers.editClient);

module.exports = route;
