const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const { errorResponse, successResponse } = require('../../helpers');
const {Employee} =  require('../../models');

const addEmployee = async (req, res, next) => {
  try{
    console.log(req.body);
  const {
    firstName,
    lastName,
    middleName,
    email,
    password,
    gender,
    DOB,
    role,
    joiningDate,
    totalExp,
  } = req.body;
  //console.log(req.body);
  const employee = await Employee.findOne(
    { 
      where: { email } 
    });
  if (employee) {
    throw new Error('employee already exist with same email id');
  }
  //console.log(employee);
    const encryptedPassword = crypto
      .createHash('md5')
      .update(password)
      .digest('hex');
    const payload = {
      id: uuidv4(),
      firstName,
      lastName,
      middleName,
      email,
      password: encryptedPassword,
      gender,
      DOB: new Date(DOB),
      role,
      joiningDate: new Date(joiningDate),
      totalExp,
    };
    //console.log(payload);
  
  const newEmployee = await Employee.create(payload);
  
  console.log(newEmployee);

  successResponse(req, res, newEmployee);
  } catch (error) {
    console.log(error);
    errorResponse(req, res, "something went wrong", 400, { err: error });
  }
}

const renderEmployeeView = (req, res) => {
  res.render('employees');
}
const renderAddEmployeeView = (req, res) => {
  res.render('add-employee');
}

module.exports = {
  addEmployee,
  renderEmployeeView,
  renderAddEmployeeView,
}