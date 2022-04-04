const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const { errorResponse, successResponse, createPassword } = require('../../helpers');
const {Employee} =  require('../../models');

const addEmployee = async (req, res, next) => {
  try{
    console.log(req.body);
  const {
    firstName,
    lastName,
    middleName,
    email,
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
      .update(createPassword(req.body.DOB))
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
  
  //const newEmployee = await Employee.create(payload);
    const contactDetailsPayload = {
      employeeId: payload.id,
      contactNo: req.body.contactNo,
      secondaryEmail: req.body.secondaryEmail || null,
      houseNo: req.body.houseNo,
      addressLine1: req.body.addressLine1,
      addressLine2: req.body.addressLine2,
      landmark: req.body.landmark,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      country: req.body.country,
    };
    const preWorkPayload = {
      employeeId: payload.id,
      previousEmployer: req.body.previousEmployer,
      employerAddress: req.body.employerAddress,
      workingTime: req.body.workingTime,
    };
    const academicPayload = {
      employeeId: payload.id,
      highestQualification: req.body.highestQualification,
      collage: req.body.collage,
      university: req.body.university,
      knownTech: req.body.knownTech,
    }
  console.log(payload);
    console.log(contactDetailsPayload);
    console.log(academicPayload);
    console.log(preWorkPayload);
  successResponse(req, res, payload);
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