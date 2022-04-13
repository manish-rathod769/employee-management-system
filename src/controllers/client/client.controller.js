import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import { successResponse, errorResponse } from '../../helpers/index';
import { Client } from '../../models';

export const addNewClient = async (req, res) => {
  try {
    const {
      name, email, slackId, city, state, country, organization,
    } = req.body;
    const clientDetails = {
      id: uuidv4(),
      name,
      email,
      slackId,
      city,
      state,
      country,
      organization,
    };
    const isUserExist = await Client.findAll({ where: { [Op.or]: [{ email }, { slackId }] } });

    if (isUserExist.length) {
      errorResponse(req, res, 'EmailID or slackID alreay exists in the database !!!', 412);
      return;
    }

    const newClient = await Client.create(clientDetails);
    successResponse(req, res, newClient, 200);
  } catch (error) {
    errorResponse(req, res, error.message, 409, error);
  }
};

export const getAllClient = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const count = Number(req.query.count) || 6;
    const sortBy = req.query.sortBy || 'name';
    const sortOrder = req.query.sortOrder || 'ASC';
    const searchWord = req.query.searchWord || '';

    const allClients = await Client.findAll({
      where: { [Op.or]: [{ name: { [Op.iLike]: `%${searchWord}%` } }, { email: { [Op.iLike]: `%${searchWord}%` } }, { slackId: { [Op.iLike]: `%${searchWord}%` } }, { city: { [Op.iLike]: `%${searchWord}%` } }, { state: { [Op.iLike]: `%${searchWord}%` } }, { country: { [Op.iLike]: `%${searchWord}%` } }, { organization: { [Op.iLike]: `%${searchWord}%` } }] }, attributes: ['id', 'name', 'email', 'slackId', 'organization'], order: [[`${sortBy}`, `${sortOrder}`]], offset: (page - 1) * count, limit: count,
    });
    const totalCount = await Client.findAll({ where: { [Op.or]: [{ name: { [Op.iLike]: `%${searchWord}%` } }, { email: { [Op.iLike]: `%${searchWord}%` } }, { slackId: { [Op.iLike]: `%${searchWord}%` } }, { city: { [Op.iLike]: `%${searchWord}%` } }, { state: { [Op.iLike]: `%${searchWord}%` } }, { country: { [Op.iLike]: `%${searchWord}%` } }, { organization: { [Op.iLike]: `%${searchWord}%` } }] } });

    allClients.push({ totalCount: totalCount.length });
    successResponse(req, res, allClients, 200);
  } catch (error) {
    errorResponse(req, res, error.message, 500, error);
  }
};

export const editClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const {
      name, city, state, country, organization, isArchived,
    } = req.body;
    const updatedClient = await Client.update({
      name, city, state, country, organization, isArchived,
    }, { returning: true, where: { id: clientId } });
    successResponse(req, res, updatedClient[1], 200);
  } catch (error) {
    errorResponse(req, res, error.message, 500, error);
  }
};

export const getOneClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const matchedClient = await Client.findOne({ where: { id: clientId } });
    if (!matchedClient) {
      errorResponse(req, res, 'Client data does not exist !!!!', 412);
      return;
    }
    successResponse(req, res, matchedClient, 200);
  } catch (error) {
    errorResponse(req, res, error.message, 500, error);
  }
};
