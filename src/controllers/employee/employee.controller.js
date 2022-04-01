const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const { errorResponse, successResponse } = require('../../helpers');
import Employee from '../../models/employee';

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
  console.log(req.body);
  // const employee = await Employee.findOne(
  //   { 
  //     where: { email } 
  //   });
  // if (employee) {
  //   throw new Error('employee already exist eith same email id');
  // }

  const encryptedPassword = crypto
                  .createHash('md5')
                  .update(password)
                  .digest('hex');
  
  const newEmployee = await Employee.create(
    {
      id: uuidv4(),
      firstName,
      lastName,
      middleName,
      email,
      password: encryptedPassword,
      gender,
      DOB,
      role,
      joiningDate,
      totalExp,
    }  
  );
  
  console.log(newEmployee);
  successResponse(req, res, newEmployee);
  } catch (error) {
    console.log(error);
    errorResponse(req, res, "something went wrong", 400, { err: error });
  }
}

module.exports = {
  addEmployee,
}