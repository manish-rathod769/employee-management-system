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
    const totalEmployee = Employee.count();

    if (totalEmployee > (page*limit)) {
      result.next = true;
    }
    if (startIndex > 0) {
      result.pre = true
    }

    result.employee = await Employee.findAll(
      { 
        include: [EmployeeContact, EmployeeAcademic, EmployeePreWork],
        offset: startIndex,
        limit: limit,
        order: [
          ['firstName', order]
        ]
      });

    res.status(200);
    successResponse(req, res, result, 200);
  } catch (error) {
    errorResponse(req, res, "something went wrong", 500, error);
  }
  
}

export const renderEmployeeView = async (req, res) => {
  const countEmployee = await Employee.count();
  res.render('employees');
}
export const renderAddEmployeeView = (req, res) => {
  res.render('add-employee');
}
