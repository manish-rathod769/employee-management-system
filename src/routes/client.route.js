import express from 'express';
import { clientRegisterValidation, clientUpdateDataValidation } from '../controllers/client/client.validator';
import * as clietControllers from '../controllers/client/client.controller';

const route = express.Router();

route.get('/clients', clietControllers.getAllClientController);
route.post('/clients', clientRegisterValidation, clietControllers.clientRegisterController);
route.put('/clients/:clientId', clientUpdateDataValidation, clietControllers.clientUpdateDataController);

module.exports = route;
