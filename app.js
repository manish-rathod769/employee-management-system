import express from 'express';
import dotenv from 'dotenv';

import bodyParser from 'body-parser';
import cors from 'cors';

import publicRoutes from './src/routes/public';
import employeeRoutes from './src/routes/employee.route';
dotenv.config();
require('./src/config/sequelize');

const app = express();
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use(cors());
app.use(bodyParser.json());
app.use('/pub', publicRoutes);

app.use('/', employeeRoutes);
module.exports = app;
