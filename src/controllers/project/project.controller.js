import { Employee, Project, ProjectClient, ProjectEmployee } from '../../models';
import { successResponse, errorResponse } from '../../helpers/index';
import { v4 as uuidv4 } from 'uuid';
import employee from '../../models/employee';

const addProject = async (req, res) => {
  try {
    const { name, type, probable_end_date } = req.body;
    const payload = {
      projectId: uuidv4(),
      name,
      type,
      status: 'Not Started',
      probable_end_date,
    };
    const newProject = await Project.create(payload);
    successResponse(req, res, newProject, 200);
  } catch (error) {
    errorResponse(req, res, error.message);
  }
};

const singleProject = async (req, res) => {
  const { id } = req.params;
  const matchedProject = await Project.findOne({ where: { projectId: id } });
  if (!matchedProject) {
    errorResponse(req, res, 'Not Project Found', 404);
  }
  successResponse(req, res, matchedProject, 200);
};

const viewProject = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const count = Number(req.query.count) || 12;
    const allProjects = await Project.findAll({ offset: (page - 1) * count, limit: count });
    const isDataBefore = await Project.findAll({ where: { isArchived: false }, limit: (page - 1) * count });
    const isDataAfter = await Project.findAll({ where: { isArchived: false }, offset: page * count });
    const paginationDetails = { before: isDataBefore.length, after: isDataAfter.length };
    allProjects.push(paginationDetails);
    successResponse(req, res, allProjects, 200);
  } catch (error) {
    errorResponse(req, res, error.message, 500, error);
  }
};

const updateProject = async (req, res) => {
  try {
    const ProjectId =  req.params.id;
    const { client, pm, dev } = req.body;
    client.forEach( async (client) => {
      await ProjectClient.create({ projectId: ProjectId, clientId: client });
    });

    pm.forEach( async (pm) => {
      console.log(pm);
      console.log(typeof pm);
      await ProjectEmployee.create({ projectId: ProjectId, employeeId: pm });
    });
    dev.forEach( async (dev) => {
      console.log(dev);
      console.log(typeof dev);
      await ProjectEmployee.create({ projectId: ProjectId, employeeId: dev });
    });
    const { name, type, status, probable_end_date, isArchived } = req.body;
    const updatedProject = await Project.update({ name, type, status, probable_end_date, isArchived }, { returning: true, where: { projectId: ProjectId } });
    successResponse(req, res, updatedProject[1], 200);
  } catch (error) {
    errorResponse(req, res, error.message, 500, error);
  }
};

const projectEmployee = async (req, res) => {
  try {
    const { projectId } = req.params;
    const data = await ProjectEmployee.findAll({ 
      include: [{
        model: Employee,
        attributes: ['role'],
      }],
      where: { projectId }, attributes: ['employeeId']
    });
    successResponse(req, res, data, 200);
  } catch(error) {
    errorResponse(req, res, error.message, 500, error);
  }
}

const projectClient = async (req, res) => {
  try {
    const { projectId } = req.params;
    const data = await ProjectClient.findAll({ where: { projectId }, attributes: ['clientId']});
    successResponse(req, res, data, 200);
  } catch(error) {
    errorResponse(req, res, error.message, 500, error);
  }
}

module.exports = { singleProject, addProject, updateProject, viewProject, projectEmployee, projectClient };