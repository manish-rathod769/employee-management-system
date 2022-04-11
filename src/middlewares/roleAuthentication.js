/* eslint-disable no-console */
import { errorResponse } from '../helpers/index';

export const checkRoleForAdmin = async (req, res, next) => {
  try {
    const roleAsPerDB = (req.role).toLowerCase();
    const roleAsPerRoute = (req.url.split('/')[1]).toLowerCase();
    if (roleAsPerRoute !== roleAsPerDB) {
      const { email } = req;
      errorResponse(req, res, `${email} does not have ${roleAsPerRoute} role !!!`);
      // res.render('login', { error: `${email} does not have ${roleAsPerRoute} role !!!` });
      return;
    }
    req.role = roleAsPerRoute;
    next();
  } catch (error) {
    errorResponse(req, res, error.message, 401);
    // res.render('login', { error: error.message });
  }
};

export const checkRoleForEmployee = async (req, res, next) => {
  try {
    const roleAsPerDB = (req.role).toLowerCase();
    if (roleAsPerDB !== 'dev') {
      const { email } = req;
      errorResponse(req, res, `${email} does not have dev role !!!`);
      // res.render('login', { error: `${email} does not have ${roleAsPerRoute} role !!!` });
      return;
    }
    req.role = 'dev';
    next();
  } catch (error) {
    errorResponse(req, res, error.message, 401);
    // res.render('login', { error: error.message });
  }
};
