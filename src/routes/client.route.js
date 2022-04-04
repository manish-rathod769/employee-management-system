import express from 'express';
import { clientRegisterValidation, } from '../controllers/client/client.validator';
import { clientRegisterController, getAllClientController, } from '../controllers/client/client.controller';

const route = express.Router();

route.get('/clients', getAllClientController);
route.post('/clients', clientRegisterValidation, clientRegisterController);

module.exports = route;