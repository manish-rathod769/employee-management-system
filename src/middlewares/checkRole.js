import { errorResponse } from '../helpers/index';
import { Employee } from '../models';

// eslint-disable-next-line consistent-return
const checkRole = async (req, res, next) => {
  try {
    const employeeEmail = req.email;
    const matchedEmp = await Employee.findOne({ where: { email: employeeEmail }, attributes: ['role'] });
    if (!matchedEmp) {
      return errorResponse(req, res, 'Email does not exist...');
    }
    req.role = matchedEmp.role;
    next();
  } catch (error) {
    errorResponse(req, res, error.message, 401);
    // res.render('login', { error: error.message });
  }
};

module.exports = checkRole;
