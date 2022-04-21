import { errorResponse } from '../helpers/index';

export const roleAdmin = (flagRender) => {
  return (req, res, next) => {
    try {
      if(req.user.role === 'ADMIN'){
        next();
      } else {
        throw new Error('You do not have permission to access this route !!!');
      }
    } catch(err) {
      if(flagRender){
        res.status(401);
        return res.render('message', { error: err.message, message: '', route: '', text: 'Back' });
      }else{
        return errorResponse(req, res, err.message, 401);
      }
    }
  }
}

export const rolePM = (flagRender) => {
  return (req, res, next) => {
    try {
      if(req.user.role === 'PM'){
        next();
      } else {
        throw new Error('You do not have permission to access this route !!!');
      }
    } catch(err) {
      if(flagRender){
        res.status(401);
        return res.render('message', { error: err.message, message: '', route: '', text: 'Back' });
      }else{
        return errorResponse(req, res, err.message, 401);
      }
    }
  }
}

export const roleHR = (flagRender) => {
  return (req, res, next) => {
    try {
      if(req.user.role === 'HR'){
        next();
      } else {
        throw new Error('You do not have permission to access this route !!!');
      }
    } catch(err) {
      if(flagRender){
        res.status(401);
        return res.render('message', { error: err.message, message: '', route: '', text: 'Back' });
      }else{
        return errorResponse(req, res, err.message, 401);
      }
    }
  }
}

export const roleDEV = (flagRender) => {
  return (req, res, next) => {
    try {
      if(req.user.role === 'DEV'){
        next();
      } else {
        throw new Error('You do not have permission to access this route !!!');
      }
    } catch(err) {
      if(flagRender){
        res.status(401);
        return res.render('message', { error: err.message, message: '', route: '', text: 'Back' });
      }else{
        return errorResponse(req, res, err.message, 401);
      }
    }
  }
}

export const role_Admin_PM_HR = (flagRender) => {
  return (req, res, next) => {
    try {
      if(['ADMIN', 'PM', 'HR'].includes(req.user.role)){
        next();
      } else {
        throw new Error('You do not have permission to access this route !!!');
      }
    } catch(err) {
      if(flagRender){
        res.status(401);
        return res.render('message', { error: err.message, message: '', route: '', text: 'Back' });
      }else{
        return errorResponse(req, res, err.message, 401);
      }
    }
  }
}

export const role_All = (flagRender) => {
  return (req, res, next) => {
    try {
      if(['ADMIN', 'PM', 'HR', 'DEV'].includes(req.user.role)){
        next();
      } else {
        throw new Error('You do not have permission to access this route !!!');
      }
    } catch(err) {
      if(flagRender){
        res.status(401);
        return res.render('message', { error: err.message, message: '', route: '', text: 'Back' });
      }else{
        return errorResponse(req, res, err.message, 401);
      }
    }
  }
}
