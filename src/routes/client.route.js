import express from 'express';
import { clientRegisterValidation, clientUpdateDataValidation } from '../controllers/client/client.validator';
import { clientRegisterController, getAllClientController, clientUpdateDataController, clientSoftDeleteController } from '../controllers/client/client.controller';

const route = express.Router();

route.get('/clients', getAllClientController);
route.post('/clients', clientRegisterValidation, clientRegisterController);
route.put('/clients/:clientId', clientUpdateDataValidation, clientUpdateDataController);
route.delete('/clients/:clientId', clientSoftDeleteController);

module.exports = route;