import { errorResponse } from '../helpers/index';

export const roleAdmin = (flagRender) => {
  const adminRoleMidd = (req, res, next) => {
    try {
      if (req.user.role === 'ADMIN') {
        return next();
      }
      return errorResponse(req, res, 'You do not have permission to access this route !!!', 401);
    } catch (err) {
      if (flagRender) {
        res.status(401);
        return res.render('message', {
          error: err.message,
          message: '',
          route: '',
          text: 'Back',
        });
      }
      return errorResponse(req, res, err.message, 401);
    }
  };
  return adminRoleMidd;
};

export const rolePM = (flagRender) => {
  const PMRoleMidd = (req, res, next) => {
    try {
      if (req.user.role === 'PM') {
        return next();
      }
      return errorResponse(req, res, 'You do not have permission to access this route !!!', 401);
    } catch (err) {
      if (flagRender) {
        res.status(401);
        return res.render('message', {
          error: err.message,
          message: '',
          route: '',
          text: 'Back',
        });
      }
      return errorResponse(req, res, err.message, 401);
    }
  };
  return PMRoleMidd;
};

export const roleHR = (flagRender) => {
  const HRRoleMidd = (req, res, next) => {
    try {
      if (req.user.role === 'HR') {
        return next();
      }
      return errorResponse(req, res, 'You do not have permission to access this route !!!', 401);
    } catch (err) {
      if (flagRender) {
        res.status(401);
        return res.render('message', {
          error: err.message,
          message: '',
          route: '',
          text: 'Back',
        });
      }
      return errorResponse(req, res, err.message, 401);
    }
  };
  return HRRoleMidd;
};

export const roleDEV = (flagRender) => {
  const DEVRoleMidd = (req, res, next) => {
    try {
      if (req.user.role === 'DEV') {
        return next();
      }
      return errorResponse(req, res, 'You do not have permission to access this route !!!', 401);
    } catch (err) {
      if (flagRender) {
        res.status(401);
        return res.render('message', {
          error: err.message,
          message: '',
          route: '',
          text: 'Back',
        });
      }
      return errorResponse(req, res, err.message, 401);
    }
  };
  return DEVRoleMidd;
};

export const roleAdminPmHr = (flagRender) => {
  const adminPmHrRoleMidd = (req, res, next) => {
    try {
      if (['ADMIN', 'PM', 'HR'].includes(req.user.role)) {
        return next();
      }
      return errorResponse(req, res, 'You do not have permission to access this route !!!', 401);
    } catch (err) {
      if (flagRender) {
        res.status(401);
        return res.render('message', {
          error: err.message,
          message: '',
          route: '',
          text: 'Back',
        });
      }
      return errorResponse(req, res, err.message, 401);
    }
  };
  return adminPmHrRoleMidd;
};

export const roleAll = (flagRender) => {
  const allRoleMidd = (req, res, next) => {
    try {
      if (['ADMIN', 'PM', 'HR', 'DEV'].includes(req.user.role)) {
        return next();
      }
      return errorResponse(req, res, 'You do not have permission to access this route !!!', 401);
    } catch (err) {
      if (flagRender) {
        res.status(401);
        return res.render('message', {
          error: err.message,
          message: '',
          route: '',
          text: 'Back',
        });
      }
      return errorResponse(req, res, err.message, 401);
    }
  };
  return allRoleMidd;
};
