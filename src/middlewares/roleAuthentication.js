/* eslint-disable no-console */
import { errorResponse } from '../helpers/index';

// eslint-disable-next-line import/prefer-default-export
export const checkRoleForAdmin = async (req, res, next) => {
  try {
    const roleAsPerDB = (req.role).toLowerCase();
    const roleAsPerRoute = (req.url.split('/')[1]).toLowerCase();
    if (roleAsPerRoute !== roleAsPerDB) {
      const { email } = req;
      errorResponse(req, res, `${email} does not have ${roleAsPerRoute} role !!!`);
      return;
    }
    req.role = roleAsPerRoute;
    next();
  } catch (error) {
    errorResponse(req, res, error.message, 401);
    // res.render('login', { error: error.message });
  }
};
