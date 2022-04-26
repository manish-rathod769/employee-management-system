import { v4 as uuidv4 } from 'uuid';
import { sign } from 'jsonwebtoken';
import { Op, Sequelize } from 'sequelize';
import * as helpers from '../../helpers';
import { sendRegistrationMail, sendForgotPasswordMail } from '../../helpers/email.helper';

import {
  ADMIN, DEV, HR, PM,
} from '../../constants';

import {
  Employee,
  EmployeeContact,
  EmployeeAcademic,
  EmployeePreWork,
  Technology,
  ProjectEmployee,
  EmployeeTech,
} from '../../models';

export const addEmployee = async (req, res) => {
  try {
    // check for if employee exists
    const employee = await Employee.findOne(
      {
        where: { email: req.body.email },
      },
    );
    if (employee) {
      return helpers.errorResponse(req, res, `user with email ${req.body.email} already exists`, 409);
    }

    // password is auto generated for all employees
    const password = helpers.generatePassword();
    const encryptedPassword = helpers.encryptPassword(password);

    // make array of known tech id from technology table
    const techList = await Technology.findAll(
      {
        where: {
          techName: {
            [Op.like]: { [Op.any]: req.body.knownTech },
          },
        },
        attributes: ['id'],
      },
    );
    const techIdList = techList.map(elem => elem.id);

    const payload = {
      id: req.file.filename || uuidv4(),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      middleName: req.body.middleName,
      email: req.body.email,
      password: encryptedPassword,
      gender: req.body.gender,
      DOB: new Date(req.body.dob),
      role: req.body.role,
      joiningDate: new Date(req.body.joiningDate),
      careerStartDate: new Date(req.body.careerStartDate),
      knownTech: techIdList,
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

    Promise.all([
      Employee.create(payload),
      EmployeeContact.create(contactDetailsPayload),
      EmployeeAcademic.create(academicPayload),
      EmployeePreWork.create(preWorkPayload),
    ])
      .then(async (result) => {
        const newEmployee = {
          personal: result[0],
          contact: result[1],
          academic: result[2],
          preWork: result[3],
        };

        // employee tech cross table
        try {
          await newEmployee.personal.addTechnology(techList);
        } catch (error) {
          return helpers.errorResponse(req, res, 'Technology mapping Error!', 500, error.message);
        }

        // upload image to bucket
        try {
          await helpers.cloudUpload(req.file);
        } catch (error) {
          return helpers.errorResponse(req, res, 'Technology mapping Error!', 500, error.message);
        }

        // send registration mail
        sendRegistrationMail(payload, password);
        // console.log(JSON.stringify(newEmployee, null, 2));
        return helpers.successResponse(req, res, newEmployee);
      })
      .catch((error) => {
        helpers.deleteFile(req.file.path);
        return helpers.errorResponse(req, res, 'Employee data entry Error!', 500, error.message);
      });
  } catch (error) {
    helpers.deleteFile(req.file.path);
    return helpers.errorResponse(req, res, 'something went wrong', 500, { err: error });
  }
};

export const getEmployee = async (req, res) => {
  try {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const order = /DESC/i.test(req.query.order) ? 'DESC' : 'ASC';
    const { search } = req.query;

    const result = {};

    // pagination
    const totalEmployee = await Employee.count();
    const startIndex = (page - 1) * limit;

    if (totalEmployee > (page * limit)) {
      result.next = true;
    }
    if (startIndex > 0) {
      result.pre = true;
    }

    if (req.query.role === PM) {
      result.employee = await Employee.scope('admin').findAll({
        attributes: ['email', 'id'],
        where: {
          role: 'PM',
        },
      });
    } else if (req.query.role === DEV) {
      result.employee = await Employee.scope('admin').findAll({
        attributes: ['email', 'id'],
        where: {
          role: 'DEV',
        },
      });
    } else if (req.user.role === HR || req.user.role === ADMIN) {
      result.role = req.user.role;

      // find all employee with search
      result.employee = await Employee.scope('admin').findAll(
        {
          // data redundancy
          include: [
            {
              model: EmployeeAcademic,
              attributes: ['knownTech'],
            },
            {
              model: Technology,
              attributes: ['techName'],
              // required: false,
              duplicating: false,
            },
          ],
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
              { '$Technologies.techName$': { [Op.iLike]: `%${search}%` } },
              Sequelize.literal(`"Employee"."role"::TEXT ILIKE '%${search || ''}%'`),
            ],
          },
        },
      );
    } else if (req.user.role === PM) {
      result.role = req.user.role;
      let projects = await ProjectEmployee.findAll(
        {
          where: {
            employeeId: req.user.id,
          },
          attributes: ['projectId'],
        },
      );
      projects = projects.map(elem => elem.projectId);

      // search employee related to PM's project
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
            },
            {
              model: Technology,
              attributes: ['techName'],
            },
          ],
          attributes: ['id', 'firstName', 'lastName', 'role', 'email', 'avatar'],
          offset: startIndex,
          limit,
          distinct: true,
          order: [
            ['firstName', order],
          ],
          where: {
            [Op.or]: [
              { firstName: { [Op.iLike]: `%${search || ''}%` } },
              { lastName: { [Op.iLike]: `%${search || ''}%` } },
              { email: { [Op.iLike]: `%${search || ''}%` } },
              Sequelize.literal(`"Employee"."role"::TEXT ILIKE '%${search || ''}%'`),
            ],
          },
        },
      );
    }

    // console.log(totalEmployee);
    // console.log(JSON.stringify(result.employee, null, 2));
    res.status(200);
    return helpers.successResponse(req, res, result, 200);
  } catch (error) {
    // console.log(JSON.stringify(error));
    return helpers.errorResponse(req, res, 'something went wrong', 500, error.message);
  }
};

export const getEmployeeOne = async (req, res) => {
  try {
    const employee = await Employee.scope('admin').findOne(
      {
        where: { id: req.params.employeeId },
        include: [EmployeeContact, EmployeeAcademic, EmployeePreWork,
          {
            model: Technology,
            attributes: ['techName'],
          },
        ],
      },
    );
    // console.log(employee);
    res.status(200);
    return helpers.successResponse(req, res, employee, 200);
  } catch (error) {
    return helpers.errorResponse(req, res, 'something went wrong', 500, error.message);
  }
};

export const updateEmployee = async (req, res) => {
  try {
    // find if employee with email and id exists
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

    const techList = await Technology.findAll(
      {
        where: {
          techName: {
            [Op.like]: { [Op.any]: req.body.knownTech },
          },
        },
        attributes: ['id'],
      },
    );
    const techIdList = techList.map(elem => elem.id);
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
      knownTech: techIdList,
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

    if (req.file) {
      payload.avatar = `https://employee-avatar.s3.amazonaws.com/${req.file.filename}`;
      try {
        await helpers.cloudUpload(req.file);
      } catch (error) {
        return helpers.errorResponse(req, res, 'profile pic update Error', 500, error.message);
      }
    }

    // update data in database
    Promise.all([
      employee.update(payload),

      EmployeeContact.update(contactDetailsPayload,
        { where: { employeeId: req.params.employeeId } }),

      EmployeeAcademic.update(academicPayload,
        { where: { employeeId: req.params.employeeId } }),

      EmployeePreWork.update(preWorkPayload,
        { where: { employeeId: req.params.employeeId } }),
    ])
      .then(async (result) => {
        const newEmployee = {
          personal: result[0],
          contact: result[1],
          academic: result[2],
          preWork: result[3],
        };

        await EmployeeTech.destroy({
          where: {
            employeeId: employee.id,
          },
        });
        await newEmployee.personal.addTechnology(techList);

        res.status(201);
        return helpers.successResponse(req, res, newEmployee, 201);
      })
      .catch(error => helpers.errorResponse(req, res, 'Employee details update error!', 500, error.message));
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
    return helpers.successResponse(req, res, 'employee data archived', 202);
  } catch (error) {
    return helpers.errorResponse(req, res, 'something went wrong!', 500, error.message);
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
      return helpers.errorResponse(req, res, 'The Email or Password is incorrect.', 404);
    }

    const encryptedPassword = helpers.encryptPassword(req.body.password);
    if (encryptedPassword !== employee.password) {
      return helpers.errorResponse(req, res, 'The Email or Password is incorrect.', 404);
    }

    // check for role
    if (employee.role !== req.body.role) {
      return helpers.errorResponse(req, res, 'The role is wrong', 401);
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
      res.status(200);
      result.redirect = `employee/${employee.id}/change-password`;
      return helpers.successResponse(req, res, result, 200);
    }

    // redirect to the profile page
    res.status(200);
    if (employee.role === DEV) {
      result.redirect = `/employee/${employee.id}`;
    } else {
      result.redirect = '/';
    }
    return helpers.successResponse(req, res, result, 200);
  } catch (error) {
    return helpers.errorResponse(req, res, 'something went wrong', 500, error.message);
  }
};

export const logOut = async (req, res) => {
  try {
    res.clearCookie('verifyToken');
    res.status(200);
    return res.render('message', {
      error: '',
      message: 'Logged out successfully !!!',
      route: '/login',
      text: 'Login',
    });
  } catch (error) {
    return helpers.errorResponse(req, res, 'something went wrong', 200, error.message);
  }
};

export const changePassword = async (req, res) => {
  try {
    // take email data.
    const employee = await Employee.scope('login').findOne(
      {
        where: {
          id: req.params.employeeId,
        },
        attributes: ['password', 'idDefaultPassword'],
      },
    );

    const curruntPassword = helpers.encryptPassword(req.body.currentPassword);
    const encryptedPassword = helpers.encryptPassword(req.body.newPassword);

    if (curruntPassword !== employee.password) {
      return helpers.errorResponse(req, res, 'wrong password', 404);
    }
    employee.password = encryptedPassword;
    employee.idDefaultPassword = false;
    await employee.save();

    const result = {
      redirect: '/login',
      data: 'password changed successfully!',
    };

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
      return helpers.errorResponse(req, res, 'employee does not exists', 404);
    }

    // generate new random password
    const password = helpers.generatePassword();
    const encryptedPassword = helpers.encryptPassword(password);

    // set new password to employee db
    employee.password = encryptedPassword;
    employee.idDefaultPassword = true;
    await employee.save();

    // send mail for new password
    sendForgotPasswordMail(employee, password);

    res.status(200);
    return helpers.successResponse(req, res, 'new password is sent to employee mail', 200);
  } catch (error) {
    return helpers.errorResponse(req, res, 'something went wrong', 500, error.message);
  }
};

// get technology
export const getTechnology = async (req, res) => {
  try {
    const tech = await Technology.findAll(
      {
        attributes: ['techName'],
      },
    );
    res.status(200);
    return helpers.successResponse(req, res, tech, 200);
  } catch (error) {
    return helpers.errorResponse(req, res, 'something went wrong', 500, error);
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
      return helpers.errorResponse(req, res, 'technology data already exists', 409);
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
  return res.render('employees', {
    totalEmployee,
    role: req.user.role,
  });
};

export const renderAddEmployeeView = (req, res) => {
  res.status(200);
  return res.render('add-employee');
};

export const renderEmployeeProfile = (req, res) => {
  res.status(200);
  return res.render('profile');
};

// employee side view
export const renderEmployee = (req, res) => {
  res.status(200);
  return res.render('employee/employeeProfile');
};

// render login page
export const loginView = (req, res) => {
  res.status(200);
  return res.render('employee/login', { error: '' });
};

export const forgotPasswordView = (req, res) => {
  res.status(200);
  return res.render('employee/forgotPassword');
};

export const changePasswordView = (req, res) => {
  res.status(200);
  return res.render('employee/changePassword');
};

// render setting page
export const settingView = (req, res) => {
  res.status(200);
  return res.render('settings',
    {
      role: req.user.role,
    });
};
