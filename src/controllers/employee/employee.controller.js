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
  // check for if employee exists
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
      addressLine2: req.body.addressLine2 || null,
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
    const employee = await Employee.scope('admin').findOne(
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
    // find if employee with email and id exists
    const employee = await Employee.scope('admin').findOne(
      {
        where: { 
          id: req.params.employeeId,
          email: req.body.email,
        }
      });
    if (!employee) {
      return errorResponse(req, res, `user with email ${email} does not exist`, 409);
    }
    
    // employee found update field
    const payload = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        middleName: req.body.middleName,
        gender: req.body.gender,
        DOB: new Date(req.body.DOB),
        role: req.body.role,
        joiningDate: new Date(req.body.joiningDate),
        totalExp: req.body.totalExp,
      };
    
    // update employee associate table
    const contactDetailsPayload = {
      contactNo: req.body.contactNo,
      secondaryEmail: req.body.secondaryEmail || null,
      houseNo: req.body.houseNo,
      addressLine1: req.body.addressLine1,
      addressLine2: req.body.addressLine2 || null,
      landmark: req.body.landmark,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      country: req.body.country,
    };
    const preWorkPayload = {
      previousEmployer: req.body.previousEmployer,
      employerAddress: req.body.employerAddress,
      workingTime: req.body.workingTime,
    };
    const academicPayload = {
      highestQualification: req.body.highestQualification,
      collage: req.body.collage,
      university: req.body.university,
      knownTech: req.body.knownTech,
    };

    // update data in database
    const newEmployee = {};
    newEmployee.personal = await employee.update(payload);
    newEmployee.contact = await EmployeeContact.update(contactDetailsPayload, { where: { employeeId: req.params.employeeId }});
    newEmployee.academic = await EmployeeAcademic.update(academicPayload, { where: { employeeId: req.params.employeeId } });
    newEmployee.preWork = await EmployeePreWork.update(preWorkPayload, { where: { employeeId: req.params.employeeId } });

    res.status(201);
    successResponse(req, res, newEmployee, 201);
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
    await employee.save();

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

// employee login
export const loginEmployee = async (req, res, next) => {
  try{

    // check if employee exists
    const employee = await Employee.scope('login').findOne(
      {
        where: {
          email: req.body.email,
        }
      });
    if (!employee) {
      return errorResponse(req, res, "employee does not exists", 404);
    }

    // encrypt password and dob to check for first login 
    const encryptedPassword = createHash('md5')
      .update(req.body.password)
      .digest('hex');
    const dobPassword = createHash('md5')
      .update(createPassword(employee.DOB))
      .digest('hex');
      
    if (encryptedPassword !== employee.password) {
      return errorResponse(req, res, "password does not match", 400);
    }

    // if dob password match redirect to set password page.
    if (encryptedPassword !== dobPassword) {
      // redirect to the profile page
    }

    // redirect to change password page
    res.redirect(`/employee/${employee.id}`);
  } catch (error) {
    // render with error console.
    errorResponse(req, res, "something went wrong", 500, error);
  }


}

// admin side view
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
// employee side view
export const renderEmployee = (req, res) => {
  res.status(200);
  res.render('employee/employeeProfile');
}
// render login page
export const loginView = (req, res) => {
  res.status(200);
  res.render('employee/login');
}
