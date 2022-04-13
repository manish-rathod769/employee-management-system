import express from 'express';
import { clientRegisterValidation, clientUpdateDataValidation } from '../controllers/client/client.validator';
import * as clientControllers from '../controllers/client/client.controller';

const route = express.Router();

route.get('/clients', (req, res) => res.render('clients'));
route.get('/getClients', clientControllers.getAllClient);
route.get('/clients/:clientId', clientControllers.getOneClient);
route.post('/clients', clientRegisterValidation, clientControllers.addNewClient);
route.put('/clients/:clientId', clientUpdateDataValidation, clientControllers.editClient);

module.exports = route;
