import { errorResponse, successResponse } from "../../helpers";
import { Employee, Poc } from '../../models';

export const getPoc = async (req, res) => {
  try {
    if (req.user.role === 'DEV') {
      const poc = await Poc.findAll(
        {
          attributes: ['field'],
          include: [
            {
              model: Employee,
              attributes: ['firstName', 'lastName', 'email'],
            }
          ]
        });
      // console.log(JSON.stringify(poc, null, 2));
      res.status(200);
      successResponse(req, res, poc, 200);
    } else {
      const poc = await Poc.findAll(
        {
          attributes: ['field'],
          include: [
            {
              model: Employee,
              attributes: ['firstName', 'lastName', 'email'],
            }
          ]
        });
      // console.log(JSON.stringify(poc, null, 2));
      res.status(200);
      successResponse(req, res, poc, 200);
    }
    
  } catch (error) {
    console.log(error);
    return errorResponse(req, res, 'something went wrong', 500, error.message);
  }
};

export const addPoc = async (req, res) => {
  try {
    console.log(req.body);
    let employee = await Employee.findOne(
      {
        where: {
            email: req.body.contactEmployee,
          },
        attributes: ['id'],
      });
      if (!employee) {
        return errorResponse(req, res, `employee email ${req.body.contactEmployee} does not exist`, 404);
      }

      const poc = await Poc.create(
        {
          field: req.body.field,
          employeeId: employee.id,
        }
      );
      res.status(201);
      successResponse(req, res, poc, 201);
  } catch (error) {
    return errorResponse(req, res, 'something went wrong', 500, error.message);
  }
}

export const updatePoc = async (req, res) => {
  try {
    console.log(req.body);
    let employee = await Employee.findOne(
      {
        where: {
          email: req.body.contactEmployee,
        },
        attributes: ['id'],
      });
    if (!employee) {
      return errorResponse(req, res, `employee email ${req.body.contactEmployee} does not exist`, 404);
    }

    const poc = await Poc.find(
      {
        where: {
          field: req.body.field,
        }
      });
    if (!poc) {
      return errorResponse(req, res, `Field ${req.body.field} does not exist.`, 404);
    }

    poc.employeeId = employee.id;
    await poc.save();
    res.status(201);
    successResponse(req, res, poc, 201);
  } catch (error) {
    return errorResponse(req, res, 'something went wrong', 500, error.message);
  }
}

export const renderPocView = (req, res) => {
  res.status(200);
  res.render('employee/poc');
}