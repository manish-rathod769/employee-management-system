import { v4 as uuidv4 } from 'uuid';
import { successResponse, errorResponse } from '../../helpers/index';
import { Client } from '../../models';
import { Op } from 'sequelize';

export const clientRegisterController = async (req, res) => {
  try {
    const { name, email, slackId, city, state, country, organization } = req.body;
    
    const clientDetails = {
      id: uuidv4(),
      name,
      email,
      slackId,
      city,
      state,
      country,
      organization,
      isArchive: false,
    }
    const isUserExist = await Client.findAll({ where: { [Op.or]: [{ email }, { slackId }] } });
    if (isUserExist.length) throw new Error('EmailID or slackID alreay exists in the database !!!');

    const newClient = await Client.create(clientDetails);
    successResponse(req, res, newClient, 200);
  } catch (error) {
    errorResponse(req, res, error.message, 409, error);
  }

}

export const getAllClientController = async (req, res) => {
  try {
    const page = Number(req.query.page);
    const count = Number(req.query.count);
    console.log(page, count);
    const allClients = await Client.findAll({ where: {isArchive : false}, offset: (page-1)*count, limit: count });
    // if (!allClients.length) throw new Error('Employee data does not exist !!!');
    const isDataBefore = await Client.findAll({ where: {isArchive: false }, limit: (page-1)*count });
    const isDataAfter = await Client.findAll({ where: {isArchive: false}, offset: page*count });
    
    const paginationDetails = { before: isDataBefore.length , after: isDataAfter.length};
    allClients.push(paginationDetails);
    successResponse(req, res, allClients, 200);
  } catch (error) {
    errorResponse(req, res, error.message, 500, error);
  }
}

export const clientUpdateDataController = async (req, res) => {
  try {
    const clientId = req.params.clientId;
    const { name, city, state, country, organization } = req.body;
    const updatedClient = await Client.update({ name, city, state, country, organization }, { returning: true, where: { id: clientId } });
    successResponse(req, res, updatedClient[1], 200);
  } catch (error) {
    errorResponse(req, res, error.message, 500, error);
  }
}

export const clientSoftDeleteController = async (req, res) => {
  try {
    const clientId = req.params.clientId;
    const matchedClient = await Client.findOne({ where: { id: clientId } });
    if (!matchedClient) {
      errorResponse(req, res, 'Client does not exist !!!', 500, { error: `Client does not exist with id ${clientId} !!!` });
      return;
    }

    const softDeletedCLient = await Client.update({ isArchive: true }, { returning: true, where: { id: clientId } });
    successResponse(req, res, softDeletedCLient[1], 200);
  } catch (error) {
    errorResponse(req, res, error.message, 500, error);
  }
}

export const getOneClientController = async (req, res) => {
  try{
    const clientId = req.params.clientId;
    const matchedClient = await Client.findOne({ where: {id: clientId} });
    if(!matchedClient) throw new Error('Client data does not exist');
    successResponse(req, res, matchedClient, 200);  
  }catch (error) {
    errorResponse(req, res, error.message, 500, error);
  }
}