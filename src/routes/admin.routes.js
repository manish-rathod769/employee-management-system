import express from 'express';
import { clientRegisterValidation, clientUpdateDataValidation } from '../controllers/client/client.validator';
import { clientRegisterController, getAllClientController, clientUpdateDataController, clientSoftDeleteController, getOneClientController } from '../controllers/client/client.controller';

const route = express.Router();

route.get('/admin/clients', (req, res) => res.render('clients'));
route.get('/admin/clients/:clientId', getOneClientController);

route.get('/admin/client', getAllClientController);
route.post('/admin/clients', clientRegisterValidation, clientRegisterController);
route.put('/admin/clients/:clientId', clientUpdateDataValidation, clientUpdateDataController);
route.delete('/admin/clients/:clientId', clientSoftDeleteController);

module.exports = route;