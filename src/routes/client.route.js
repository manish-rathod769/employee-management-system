import express from 'express';
import { clientRegisterValidation } from '../controllers/client/client.validator';
import { clientRegisterController } from '../controllers/client/client.controller';

const route = express.Router();

route.post('/clients', clientRegisterValidation, clientRegisterController);

module.exports = route;