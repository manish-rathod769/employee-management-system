import { Op } from 'sequelize';
import { Employee, Project, ProjectClient, ProjectEmployee, Client } from '../../models';
import { successResponse, errorResponse } from '../../helpers/index';
import { v4 as uuidv4 } from 'uuid';

const addProject = async (req, res) => {
  try {
    const { name, type, probable_end_date } = req.body;
    const payload = {
      projectId: uuidv4(),
      name,
      type,
      status: "Not Started",
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
    const sortBy = req.query.sortBy || 'name';
    const sortOrder = req.query.sortOrder || 'ASC';
    const searchWord = req.query.searchWord || '';

    // ADMIN and HR role
    if(['ADMIN', 'HR'].includes(req.user.role)) {

      const allProjects = await Project.findAll({
        where: { name: { [Op.iLike]: `%${searchWord}%`}},
        offset: (page - 1) * count, 
        order: [[`${sortBy}`, `${sortOrder}`]],
        limit: count
      });

      const totalCount = await Project.findAll({
        where: { name: { [Op.iLike]: `%${searchWord}%`}},
      })
      
      allProjects.push({ totalCount: totalCount.length });
      return successResponse(req, res, allProjects, 200);
    }
    // DEV Role
    else if (req.user.role === 'DEV' || req.user.role === 'PM') {

      let projectsId = await ProjectEmployee.findAll({
        where: { employeeId: req.user.id },
        attributes: ['projectId'],
      });
      projectsId = projectsId.map( ele => ele.projectId);
      let projectsData;
      if(req.user.role === 'DEV') {
        projectsData = await Project.findAll({
          where: { 
            [Op.and]: [{ projectId: { [Op.in]: projectsId } }, { isArchived: false }, { name: { [Op.iLike]: `%${searchWord}%` } }],
          },
          distinct: true,
          order: [[`${sortBy}`, `${sortOrder}`]],
          offset: (page - 1) * count,
          limit: count,
        });
      } else {
        projectsData = await Project.findAll({
          where: { 
            [Op.and]: [{ projectId: { [Op.in]: projectsId } }, { name: { [Op.iLike]: `%${searchWord}%` } }],
          },
          distinct: true,
          order: [[`${sortBy}`, `${sortOrder}`]],
          offset: (page - 1) * count,
          limit: count,
        });
      }
      
      const totalCount = await Project.findAll({
        where: { 
          [Op.and]: [{ projectId: { [Op.in]: projectsId } }, { isArchived: false }, { name: { [Op.iLike]: `%${searchWord}%` } }],
        },
        distinct: true,
      });

      projectsData.push({ totalCount: totalCount.length });
      return successResponse(req, res, projectsData, 200);
    }
    // PM Role
    else if(req.user.role === 'PM'){
      
    }

  } catch (error) {
    errorResponse(req, res, error.message, 500, error);
  }
};

const updateProject = async (req, res) => {
  try {
    const ProjectId =  req.params.id;
    const { client, pm, dev } = req.body;

    if(client) {
      await ProjectClient.destroy({
        where: { projectId: ProjectId },
        force: true,
      });
  
      client.forEach( async (client) => {
        await ProjectClient.create({ projectId: ProjectId, clientId: client });
      });
    }

    if(pm || dev){
      await ProjectEmployee.destroy({
        where: { projectId: ProjectId },
        force: true,
      });

      if(pm){
        pm.forEach( async (pm) => {
          console.log(pm);
          console.log(typeof pm);
          await ProjectEmployee.create({ projectId: ProjectId, employeeId: pm });
        });
      }
      if(dev){ 
        dev.forEach( async (dev) => {
          console.log(dev);
          console.log(typeof dev);
          await ProjectEmployee.create({ projectId: ProjectId, employeeId: dev });
        });
      }
    }
    
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
        distinct: true,
        attributes: ['firstName', 'lastName', 'email', 'avatar', 'gender', 'role', 'id'],
      }],
      where: { projectId }, attributes: ['employeeId']
    });
    return successResponse(req, res, data, 200);
  } catch(error) {
    errorResponse(req, res, error.message, 500, error);
  }
}

const projectClient = async (req, res) => {
  try {
    const { projectId } = req.params;
    const data = await ProjectClient.findAll({
      include: [{
        model: Client,
        attributes: ['name', 'email', 'slackId', 'city', 'state', 'country', 'organization'],
        distinct: true,
      }],
      where: { projectId }, attributes: ['clientId']});
    return successResponse(req, res, data, 200);
  } catch(error) {
    errorResponse(req, res, error.message, 500, error);
  }
}

const renderEmployeeProjectView = async(req, res) => {
  try{
    const { employeeId } = req.params;
    const matchedEmp = await Employee.findOne({ where: { id: employeeId } });
    if(!JSON.parse(JSON.stringify(matchedEmp))){
      res.status(401);
      return res.render('message', { error: 'Data doen not exist !!!', message: '', route: '', text: 'Back' });  
    }
    return res.render('employee/project');
  } catch(error) {
    res.status(401);
    return res.render('message', { error: 'Something went Wrong !!!', message: '', route: '', text: 'Back' });
  }
}

const renderViewProject = async(req, res) => {
  try{
    const { projectId } = req.params;
    const matchedPro = await Project.findOne({ where: { projectId } });
    if(!JSON.parse(JSON.stringify(matchedPro))){
      res.status(401);
      return res.render('message', { error: 'Data does not exist !!!', message: '', route: '', text: 'Back' });  
    }
    return res.render('viewProject', { projectId });
  } catch(error) {
    res.status(401);
    return res.render('message', { error: 'Something went Wrong !!!', message: '', route: '', text: 'Back' });
  }
}

module.exports = { singleProject, addProject, updateProject, viewProject, projectEmployee, projectClient, renderEmployeeProjectView, renderViewProject };