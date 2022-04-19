import express from 'express';
import { singleProject, addProject, updateProject, viewProject, projectEmployee, projectClient } from '../controllers/project/project.controller';
import projectValidation from '../controllers/project/project.validator';

const route = express.Router();

route.get('/fetchproject', viewProject);
route.post('/project', projectValidation, addProject);
route.put('/projects/:id', projectValidation, updateProject);
route.get('/projects/:id', singleProject);
route.get('/project/:projectId/employees', projectEmployee);
route.get('/project/:projectId/clients', projectClient);
route.get('/projects', (req, res) => res.render('project'));

module.exports = route;