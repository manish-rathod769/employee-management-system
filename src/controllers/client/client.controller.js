import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import { successResponse, errorResponse } from '../../helpers/index';
import { Client, ProjectEmployee, ProjectClient } from '../../models';

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

    // Clients Data for ADMIN or HR
    if (['ADMIN', 'HR'].includes(req.user.role)) {
      // Required all clients data for dropdown
      // eslint-disable-next-line no-extra-boolean-cast
      if (Boolean(req.query.all)) {
        const allClients = await Client.findAll({ where: { isArchived: false } });
        return successResponse(req, res, allClients, 500);
      }
      const allClients = await Client.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.iLike]: `%${searchWord}%` } },
            { email: { [Op.iLike]: `%${searchWord}%` } },
            { slackId: { [Op.iLike]: `%${searchWord}%` } },
            { city: { [Op.iLike]: `%${searchWord}%` } },
            { state: { [Op.iLike]: `%${searchWord}%` } },
            { country: { [Op.iLike]: `%${searchWord}%` } },
            { organization: { [Op.iLike]: `%${searchWord}%` } },
          ],
        },
        attributes: ['id', 'name', 'email', 'slackId', 'organization'],
        order: [[`${sortBy}`, `${sortOrder}`]],
        offset: (page - 1) * count,
        limit: count,
      });
      const totalCount = await Client.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.iLike]: `%${searchWord}%` } },
            { email: { [Op.iLike]: `%${searchWord}%` } },
            { slackId: { [Op.iLike]: `%${searchWord}%` } },
            { city: { [Op.iLike]: `%${searchWord}%` } },
            { state: { [Op.iLike]: `%${searchWord}%` } },
            { country: { [Op.iLike]: `%${searchWord}%` } },
            { organization: { [Op.iLike]: `%${searchWord}%` } },
          ],
        },
      });

      allClients.push({ totalCount: totalCount.length });
      return successResponse(req, res, allClients, 200);
    }

    // Project's ProjectsId which are allocated to PM
    let projectsId = await ProjectEmployee.findAll({
      where: { employeeId: req.user.id },
      attributes: ['projectId'],
    });
    projectsId = projectsId.map(elem => elem.projectId);

    // Client's client id which are associated with project
    let clientsId = await ProjectClient.findAll({
      where: { projectId: projectsId },
    });
    clientsId = clientsId.map(elem => elem.clientId);

    let projectsIds;
    let clientIdss;
    await Promise.all([
      ProjectEmployee.findAll({
        where: { employeeId: req.user.id },
        attributes: ['projectId'],
      }),
      ProjectClient.findAll({
        where: { projectId: projectsId },
      }),
    ]).then((result) => {
      projectsIds = result[0].map(elem => elem.projectId);
      clientIdss = result[1].map(elem => elem.clientId);
    });
    
    console.log(projectsIds, clientIdss);
    // Client's Data
    const clientsData = await Client.findAll({
      where: {
        [Op.and]: [
          { id: clientsId },
          { isArchived: false },
          {
            [Op.or]: [
              { name: { [Op.iLike]: `%${searchWord}%` } },
              { email: { [Op.iLike]: `%${searchWord}%` } },
              { slackId: { [Op.iLike]: `%${searchWord}%` } },
              { city: { [Op.iLike]: `%${searchWord}%` } },
              { state: { [Op.iLike]: `%${searchWord}%` } },
              { country: { [Op.iLike]: `%${searchWord}%` } },
              { organization: { [Op.iLike]: `%${searchWord}%` } },
            ],
          }],
      },
      attributes: ['id', 'name', 'email', 'slackId', 'organization'],
      distinct: true,
      order: [[`${sortBy}`, `${sortOrder}`]],
      offset: (page - 1) * count,
      limit: count,
    });

    // Pagination Details
    const totalCount = await Client.findAll({
      where: {
        [Op.and]: [
          { id: clientsId },
          { isArchived: false },
          {
            [Op.or]: [
              { name: { [Op.iLike]: `%${searchWord}%` } },
              { email: { [Op.iLike]: `%${searchWord}%` } },
              { slackId: { [Op.iLike]: `%${searchWord}%` } },
              { city: { [Op.iLike]: `%${searchWord}%` } },
              { state: { [Op.iLike]: `%${searchWord}%` } },
              { country: { [Op.iLike]: `%${searchWord}%` } },
              { organization: { [Op.iLike]: `%${searchWord}%` } },
            ],
          }],
      },
      attributes: ['id', 'name', 'email', 'slackId', 'organization'],
      distinct: true,
    });
    clientsData.push({ totalCount: totalCount.length });
    return successResponse(req, res, clientsData, 200);
  } catch (error) {
    return errorResponse(req, res, error.message, 500, error);
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
    },
    { returning: true, where: { id: clientId } });
    return successResponse(req, res, updatedClient[1], 200);
  } catch (error) {
    return errorResponse(req, res, error.message, 500, error);
  }
};

export const getOneClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const matchedClient = await Client.findOne({ where: { id: clientId } });
    if (!matchedClient) {
      return errorResponse(req, res, 'Client data does not exist !!!!', 412);
    }
    return successResponse(req, res, matchedClient, 200);
  } catch (error) {
    return errorResponse(req, res, error.message, 500, error);
  }
};
