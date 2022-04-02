import joi from 'joi';
import { errorResponse } from '../../helpers/index';

const clientRegisterObject = joi.object({
  name: joi.string().trim(true).required(),
  email: joi.string().email().trim(true).required(),
  slackId: joi.string().alphanum().min(3).trim(true).required(),
  city: joi.string().trim(true).required(),
  state: joi.string().trim(true).required(),
  country: joi.string().trim(true).required(),
  organization: joi.string().trim(true).required(),
});

export const clientRegisterValidation = async(req, res, next) => {
  const payload = {
    name: req.body.name,
    email: req.body.email,
    slackId: req.body.slackId,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
    organization: req.body.organization,
  }

  const { error } = clientRegisterObject.validate(payload);
  if(error) {
    errorResponse(req, res, error.message, 206, error.details);
  }else{
    console.log("Good to go...")
    next();
  }
}