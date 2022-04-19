import { verify } from 'jsonwebtoken';
import { errorResponse } from '../helpers';
import { Employee } from '../models';

const verifyCookie = async (req, res, next) => {
  try {
    const { verifyToken } = req.cookies;

    // Ck=heck if verifoken exist or not
    if (!verifyToken) {
      errorResponse(req, res, 'Please login first !!!', 500);
    }

    // Return Data od user. Here it will return emailID.
    const payload = verify(verifyToken, process.env.verifyToken);
    const matchedEmp = await Employee.scope('login').findOne({
      where: { email: payload.email, role: payload.role },
      attributes: ['email', 'role', 'verifyToken'],
    });
    if (!matchedEmp) {
      errorResponse(req, res, 'Data does not exist !!!', 409);
      return;
    }

    // Check if verifyToken matched or not
    if (verifyToken !== matchedEmp.verifyToken) {
      errorResponse(req, res, 'Verify token does not matcch !!!', 409);
      return;
    }

    // If token matched then send user's data to next route
    req.user = { email: payload.email, role: payload.role };
    next();
  } catch (error) {
    errorResponse(req, res, error.message, 409);
  }
};

module.exports = verifyCookie;
