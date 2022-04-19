import { v4 as uuidv4 } from 'uuid';
import { sign } from 'jsonwebtoken';
import { Op, Sequelize } from 'sequelize';
import * as helpers from '../../helpers';
import { sendRegistrationMail, sendForgotPasswordMail } from '../../helpers/email.helper';
import {
  Employee, EmployeeContact, EmployeeAcademic, EmployeePreWork, Technology, ProjectEmployee,
} from '../../models';

export const addEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      middleName,
      email,
      gender,
      dob,
      role,
      joiningDate,
      careerStartDate,
    } = req.body;

    // console.log();
    // check for if employee exists
    const employee = await Employee.findOne(
      {
        where: { email },
      },
    );
    if (employee) {
      return helpers.errorResponse(req, res, `user with email ${email} already exists`, 409);
    }

    // password is auto generated for all employees using dob as ddmmyyyy
    const password = helpers.generatePassword();
    const encryptedPassword = await helpers.encryptPassword(password);

    // make array of known tech id from technology table
    let techList = await Technology.findAll(
      {
        where: {
          techName: {
            [Op.like]: { [Op.any]: req.body.knownTech },
          },
        },
        attributes: ['id'],
      },
    );
    techList = techList.map(elem => elem.id);

    const payload = {
      id: req.file.filename || uuidv4(),
      firstName,
      lastName,
      middleName,
      email,
      password: encryptedPassword,
      gender,
      DOB: new Date(dob),
      role,
      joiningDate: new Date(joiningDate),
      careerStartDate,
      knownTech: techList,
      avatar: `https://employee-avatar.s3.amazonaws.com/${req.file.filename}`,
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
    // console.log('-----------------------------------');
    // console.log(JSON.stringify(newEmployee,null, 2));
    await helpers.cloudUpload(req.file);
    // send mail
    sendRegistrationMail(payload, password);
    helpers.successResponse(req, res, newEmployee);
  } catch (error) {
    console.log(error);
    helpers.deleteFile(req.file.path);
    return helpers.errorResponse(req, res, 'something went wrong', 400, { err: error });
  }
};

export const getEmployee = async (req, res) => {
  try {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const order = /DESC/i.test(req.query.order) ? 'DESC' : 'ASC';
    const { search } = req.query;

    const startIndex = (page - 1) * limit;

    const result = {};
    const totalEmployee = await Employee.count();

    if (totalEmployee > (page * limit)) {
      result.next = true;
    }
    if (startIndex > 0) {
      result.pre = true;
    }
    if (req.query.role === 'PM') {
      result.employee = await Employee.scope('admin').findAll({
        attributes: ['email', 'id'],
        where: {
          role: 'PM',
        },
      });
    } else if (req.query.role === 'DEV') {
      result.employee = await Employee.scope('admin').findAll({
        attributes: ['email', 'id'],
        where: {
          role: 'DEV',
        },
      });
<<<<<<< HEAD
    } else if (req.user.role === 'HR' || req.user.role === 'ADMIN') {
=======
    } else if (req.role === 'HR' || req.role === 'ADMIN') {
>>>>>>> fix: employee pm scope
      if (search) {
        // console.log('here');
        result.employee = await Employee.scope('admin').findAll(
          {
            include: [
              {
                model: EmployeeAcademic,
                attributes: ['knownTech'],
              }],
            attributes: ['id', 'firstName', 'lastName', 'role', 'email', 'avatar'],
            offset: startIndex,
            limit,
            order: [
              ['firstName', order],
            ],
            where: {
              [Op.or]: [
                { firstName: { [Op.iLike]: `%${search}%` } },
                { lastName: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } },
                Sequelize.literal(`"Employee"."role"::TEXT ILIKE '%${search}%'`),
              ],
            },
          },
        );
      } else {
        result.employee = await Employee.scope('admin').findAll(
          {
            include: [{ model: EmployeeAcademic, attributes: ['knownTech'] }],
            attributes: ['id', 'firstName', 'lastName', 'role', 'email', 'avatar'],
            offset: startIndex,
            limit,
            order: [
              ['firstName', order],
            ],
          },
        );
      }
    } else if (req.user.role === 'PM') {
      let projects = await ProjectEmployee.findAll(
        {
          where: {
            employeeId: req.user.id,
          },
          attributes: ['projectId'],
        }
      );
      projects = projects.map(elem => elem.projectId);
      if (search) {
        // console.log('here');
        result.employee = await Employee.scope('pm').findAll(
          {
            include: [
              {
                model: ProjectEmployee,
                where: {
                  projectId: {
                    [Op.in]: projects,
                  },
                },
              },
              {
                model: EmployeeAcademic,
                attributes: ['knownTech'],
                requered: true,
              }],
            attributes: ['id', 'firstName', 'lastName', 'role', 'email', 'avatar'],
            offset: startIndex,
            limit,
            distinct: true,
            order: [
              ['firstName', order],
            ],
            where: {
              [Op.or]: [
                { firstName: { [Op.iLike]: `%${search}%` } },
                { lastName: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } },
                Sequelize.literal(`"Employee"."role"::TEXT ILIKE '%${search}%'`),
              ],
            },
          },
        );
      } else {
        result.employee = await Employee.scope('pm').findAll(
          {
            include: [
              {
                model: ProjectEmployee,
                where: { 
                  projectId: {
                    [Op.in]: projects
                  }
                },
              }, 
              { model: EmployeeAcademic, attributes: ['knownTech'] }],
            attributes: ['id', 'firstName', 'lastName', 'role', 'email', 'avatar'],
            offset: startIndex,
            limit,
            distinct: true,
            order: [
              ['firstName', order],
            ],
          },
        );
      }
    }
    // console.log(totalEmployee);
    // console.log(result);
    res.status(200);
    helpers.successResponse(req, res, result, 200);
  } catch (error) {
    // console.log(JSON.stringify(error));
    helpers.errorResponse(req, res, 'something went wrong', 500, error.message);
  }
};

export const getEmployeeOne = async (req, res) => {
  try {
    const employee = await Employee.scope('admin').findOne(
      {
        where: { id: req.params.employeeId },
        include: [EmployeeContact, EmployeeAcademic, EmployeePreWork],
      },
    );
    // console.log(employee);
    res.status(200);
    helpers.successResponse(req, res, employee, 200);
  } catch (error) {
    helpers.errorResponse(req, res, 'something went wrong', 500, error.message);
  }
};

export const updateEmployee = async (req, res) => {
  try {
    // find if employee with email and id exists
    // console.log(req.params);
    const employee = await Employee.scope('admin').findOne(
      {
        where: {
          id: req.params.employeeId,
          email: req.body.email,
        },
      },
    );
    if (!employee) {
      return helpers.errorResponse(req, res, `user with email ${req.body.email} does not exist`, 409);
    }

    let techList = await Technology.findAll(
      {
        where: {
          techName: {
            [Op.like]: { [Op.any]: req.body.knownTech },
          },
        },
        attributes: ['id'],
      },
    );
    techList = techList.map(elem => elem.id);
    // employee found update field
    const payload = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      middleName: req.body.middleName,
      gender: req.body.gender,
      DOB: new Date(req.body.dob),
      role: req.body.role,
      joiningDate: new Date(req.body.joiningDate),
      careerStartDate: new Date(req.body.careerStartDate),
      knownTech: techList,
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
    // console.log('----------------------------');
    // console.log(req.file);
    if (req.file) {
      payload.avatar = `https://employee-avatar.s3.amazonaws.com/${req.file.filename}`;
      await helpers.cloudUpload(req.file);
      // console.log(upload);
    }
    // update data in database
    const newEmployee = {};
    newEmployee.personal = await employee.update(payload);
    newEmployee.contact = await EmployeeContact.update(contactDetailsPayload,
      { where: { employeeId: req.params.employeeId } });
    newEmployee.academic = await EmployeeAcademic.update(academicPayload,
      { where: { employeeId: req.params.employeeId } });
    newEmployee.preWork = await EmployeePreWork.update(preWorkPayload,
      { where: { employeeId: req.params.employeeId } });

    res.status(201);
    helpers.successResponse(req, res, newEmployee, 201);
  } catch (error) {
    return helpers.errorResponse(req, res, 'something went wrong', 500, error.message);
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    // check if employee exists or not
    const employee = await Employee.findOne(
      {
        where: {
          id: req.body.id,
        },
      },
    );
    if (!employee) {
      return helpers.errorResponse(req, res, 'employee record not found', 404);
    }
    employee.isArchive = true;
    await employee.save();

    res.status(202);
    return helpers.successResponse(req, res, '', 202);
  } catch (err) {
    return helpers.errorResponse(req, res, 'something went wrong!', 500, err.message);
  }
};

// employee login
export const loginEmployee = async (req, res) => {
  try {
    // check if employee exists
    const employee = await Employee.scope('login').findOne(
      {
        where: {
          email: req.body.email,
        },
      },
    );
    if (!employee) {
      req.flash('error', 'employee does not exist');
      return helpers.errorResponse(req, res, 'Email does not exist', 404);
      // return res.redirect(301, '/login');
    }

    // encrypt password and dob to check for first login
    const encryptedPassword = await helpers.encryptPassword(req.body.password);
    if (encryptedPassword !== employee.password) {
      req.flash('error', 'wrong password!');
      return helpers.errorResponse(req, res, 'wrong password', 401);
      // return res.redirect(301, '/login');
    }

    // check for role
    if (employee.role !== req.body.role) {
      req.flash('error', `${req.body.email} doesn't have ${req.body.role} rights`);
      return helpers.errorResponse(req, res, `${req.body.email} doesn't have ${req.body.role} rights`, 401);
      // return res.redirect(301, '/login');
    }

    // Generate Cookie, Store in DB and store in cookie
    const verifyToken = sign({ id: employee.id, email: employee.email, role: employee.role }, process.env.verifyToken, { expiresIn: '1d' });
    employee.verifyToken = verifyToken;
    await employee.save();
    res.cookie('verifyToken', verifyToken);

    const result = {
      avatar: employee.avatar,
      name: employee.firstName,
      id: employee.id,
    };
    // if default password match redirect to set password page.
    if (employee.idDefaultPassword) {
      // redirect to change password page
      res.status(200);
      result.redirect = `employee/${employee.id}/change-password`;
      return helpers.successResponse(req, res, result, 200);
      // eturn res.redirect(`employee/${employee.id}/change-password`);
    }

    // redirect to the profile page
    res.status(200);
    console.log(employee.role);
    if (employee.role === 'DEV') {
      result.redirect = `/employee/${employee.id}`;
    } else {
      result.redirect = `/`;
    }
    return helpers.successResponse(req, res, result, 200);
    // return res.redirect(301, `/employee/${employee.id}`);
  } catch (error) {
    // render with error console.
    req.flash('error', 'something went wrong');
    return res.redirect(301, '/login');
  }
};

export const logOut = async (req, res) => {
  try {
    res.clearCookie('verifyToken');
    res.status(200);
    return res.render('message', { error: '', message: 'Logged out successfully !!!', route: '/login', text: 'Login' });
  } catch (error) {
    return helpers.successResponse(req, res, result, 200);
  }
}

export const changePassword = async (req, res) => {
  try {
    // take email data.
    const employee = await Employee.scope('login').findOne(
      {
        where: {
          id: req.params.employeeId,
        },
      },
    );
    // console.log(req.body.currentPassword);
    const curruntPassword = await helpers.encryptPassword(req.body.currentPassword);
    const encryptedPassword = await helpers.encryptPassword(req.body.newPassword);
    // console.log(`${curruntPassword}-----${employee.password}`);
    if (curruntPassword !== employee.password) {
      return helpers.errorResponse(req, res, 'wrong password', 404);
    }
    employee.password = encryptedPassword;
    employee.idDefaultPassword = false;
    await employee.save();

    const  result = { redirect: `/login`};
    res.status(200);
    return helpers.successResponse(req, res, result, 201);
  } catch (error) {
    return helpers.errorResponse(req, res, 'something went wrong', 500, error.message);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const employee = await Employee.scope('login').findOne(
      {
        where: {
          email: req.body.email,
        },
      },
    );
    if (!employee) {
      helpers.errorResponse(req, res, 'employee does not exists', 404);
    }
    const password = helpers.generatePassword();
    const encryptedPassword = await helpers.encryptPassword(password);
    employee.password = encryptedPassword;
    employee.idDefaultPassword = true;
    await employee.save();
    sendForgotPasswordMail(employee, password);
    res.status(200);
    helpers.successResponse(req, res, 'new password is sent to employee mail', 200);
  } catch (error) {
    helpers.errorResponse(req, res, 'something went wrong', 500, error.message);
  }
}

// get technology
export const getTechnology = async (req, res) => {
  try {
    const tech = await Technology.findAll(
      {
        attributes: ['techName'],
      },
    );
    res.status(200);
    helpers.successResponse(req, res, tech, 200);
  } catch (error) {
    helpers.errorResponse(req, res, 'something went wrong', 500, error);
  }
};

export const addTechnology = async (req, res) => {
  try {
    const tech = await Technology.findOne(
      {
        where: {
          techName: {
            [Op.iLike]: `${req.body.techName}`,
          },
        },
      },
    );
    if (tech) {
      return helpers.errorResponse(req, res, 'technology alredy exists', 409);
    }
    const newTech = await Technology.create(
      {
        techName: req.body.techName,
      },
    );
    res.status(201);
    return helpers.successResponse(req, res, newTech, 201);
  } catch (error) {
    // console.log(error);
    return helpers.errorResponse(req, res, 'something went wrong', 500, error.message);
  }
};

// admin side view
export const renderEmployeeView = async (req, res) => {
  const totalEmployee = await Employee.count();
  res.status(200);
  res.render('employees', {
    totalEmployee,
  });
};
export const renderAddEmployeeView = (req, res) => {
  res.status(200);
  res.render('add-employee');
};
export const renderEmployeeProfile = (req, res) => {
  res.status(200);
  res.render('profile');
};
// employee side view
export const renderEmployee = (req, res) => {
  res.status(200);
  res.render('employee/employeeProfile');
};
// render login page
export const loginView = (req, res) => {
  res.status(200);
  console.log(req.locals);
  return res.render('employee/login', {error: ''});
};
export const forgotPasswordView = (req, res) => {
  res.status(200);
  res.render('employee/forgotPassword');
};
export const changePasswordView = (req, res) => {
  res.status(200);
  res.render('employee/changePassword');
};
// render setting page
export const settingView = (req, res) => {
  res.status(200);
  res.render('settings');
};
