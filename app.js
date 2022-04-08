import express from 'express';
import dotenv from 'dotenv';

import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import flash from 'connect-flash';
import session from 'express-session';


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
app.use(session({ 
  secret: process.env.SECRET,
  secure: true,
  resave: true,
  saveUninitialized: true, 
  cookie: { maxAge: 60000 } 
}));
app.use(cors());
app.use(flash());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'public')));
//app.use('/employee/assets', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use('/', employeeRoutes);
module.exports = app;
