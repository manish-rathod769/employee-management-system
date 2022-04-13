import express from 'express';
import { clientRegisterValidation, clientUpdateDataValidation } from '../controllers/client/client.validator';
import * as clientControllers from '../controllers/client/client.controller';

const route = express.Router();

route.get('/clients', (req, res) => res.render('clients'));
route.get('/clients/:clientId', clientControllers.viewOneClient);
route.get('/viewClient', clientControllers.viewAllClient);
route.post('/clients', clientRegisterValidation, clientControllers.addNewClient);
route.put('/clients/:clientId', clientUpdateDataValidation, clientControllers.updateClient);

module.exports = route;
