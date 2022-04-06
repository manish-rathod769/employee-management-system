import { createHash } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { errorResponse, successResponse, createPassword, getTimeBetweenDates } from '../../helpers';
import { Employee, EmployeeContact, EmployeeAcademic, EmployeePreWork } from '../../models';

export const addEmployee = async (req, res, next) => {
  try{

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

  console.log();
  const employee = await Employee.findOne(
    { 
      where: { email } 
    });
  if (employee) {
    return errorResponse(req, res, `user with email ${email} already exists`, 409);
  }

  // password is auto generated for all employees using dob as ddmmyyyy
    const encryptedPassword = createHash('md5')
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
      workingTime: `${getTimeBetweenDates(req.body.startDate, req.body.endDate)}`,
    };
    const academicPayload = {
      employeeId: payload.id,
      highestQualification: req.body.highestQualification,
      collage: req.body.collage,
      university: req.body.university,
      knownTech: req.body.knownTech,
    };

  const newEmployee = {};
  newEmployee.personal = await Employee.create(payload);  
  newEmployee.contact = await EmployeeContact.create(contactDetailsPayload);
  newEmployee.academic = await EmployeeAcademic.create(academicPayload);
  newEmployee.preWork = await EmployeePreWork.create(preWorkPayload);

  successResponse(req, res, newEmployee);
  } catch (error) {
    console.log(error);
    errorResponse(req, res, "something went wrong", 400, { err: error });
  }
}

export const getEmployee = async (req, res, next) => {
  try{
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const order = /DESC/i.test(req.query.order) ? 'DESC' : 'ASC';
    const startIndex = (page-1) * limit;
    
    let result = {};
    const totalEmployee = await Employee.count();

    if (totalEmployee > (page*limit)) {
      result.next = true;
    }
    if (startIndex > 0) {
      result.pre = true
    }

    result.employee = await Employee.scope('admin').findAll(
      { 
        include: [{ model: EmployeeAcademic, attributes: ['knownTech'] }],
        attributes: ['id', 'firstName', 'lastName', 'role', 'email'],
        offset: startIndex,
        limit: limit,
        order: [
          ['firstName', order]
        ]
      });
    // console.log(totalEmployee);
    // console.log(result);
    res.status(200);
    successResponse(req, res, result, 200);
  } catch (error) {
    errorResponse(req, res, "something went wrong", 500, error);
  } 
}

export const getEmployeeOne = async (req, res, next) => {
  try {
    const employee = await Employee.findOne(
      {
        where: { id: req.params.employeeId },
        include: [EmployeeContact, EmployeeAcademic, EmployeePreWork],
      });
    // console.log(employee);
    res.status(200);
    successResponse(req, res, employee, 200);
  } catch (error) {
    errorResponse(req, res, "something went wrong", 500, error);
  }
}

export const updateEmployee = async (req, res, next) => {
  try{

  } catch (err) {
    errorResponse(req, res, "something went wrong", 500, {err});
  }
}

export const deleteEmployee = async (req, res, next) => {
  try{
    // check if employee exists or not
    const employee = await Employee.findOne(
      {
        where: {
          id: req.body.id,
      }
    });
    if(!employee){
      return errorResponse(req, res, "employee record not found", 404);
    }
    employee.isArchive = true;
    employee.save();
    
    res.status(202);
    successResponse(req, res, "", 202);
  } catch (err) {
    errorResponse(req, res, "something went wrong!", 500, {err});
  }
}

export const searchEmployee = async (req, res, next) => {
  try{
    
  } catch (error) {
    errorResponse(req, res, "something went wrong", 500, error.message);
  }
}

export const renderEmployeeView = async (req, res) => {
  const totalEmployee = await Employee.count();
  res.status(200);
  res.render('employees', {
    totalEmployee,
  });
}
export const renderAddEmployeeView = (req, res) => {
  res.status(200);
  res.render('add-employee');
}
export const renderEmployeeProfile = (req, res) => {
  res.status(200);
  res.render('profile');
}
