import { errorResponse, isValidTech } from '../../helpers';
import joi from 'joi';

const validation = joi.object({
  firstName: joi.string().trim(true).required(),
  lastName: joi.string().trim(true).required(),
  middleName: joi.string().trim(true),
  email: joi.string().email().trim(true).required(),
  gender: joi.string().trim(true).valid('male', 'female').required(),
  DOB: joi.date().less('now').required(),
  //password: joi.string().trim(true).min(8).max(12).required(),
  joiningDate: joi.date().required(),
  role: joi.string().trim(true).valid('ADMIN', 'DEV', 'PM', 'HR').required(),
  totalExp: joi.number().required(),

  contactNo: joi.string().trim(true).required(),
  secondaryEmail: joi.string().email().trim(true),
  houseNo: joi.string().trim(true).required(),
  addressLine1: joi.string().trim(true).required(),
  addressLine2: joi.string().trim(true),
  landmark: joi.string().trim(true).required(),
  city: joi.string().trim(true).required(),
  state: joi.string().trim(true).required(),
  pincode: joi.string().trim(true).length(6).required(),
  country: joi.string().trim(true).required(),

  previousEmployer: joi.string().trim(true),
  employerAddress: joi.string().trim(true),
  workingTime: joi.string().trim(true),

  highestQualification: joi.string().trim(true).required(),
  collage: joi.string().trim(true).required(),
  university: joi.string().trim(true).required(),
  knownTech: joi.array().items(joi.string().required()),
});

export const employeeValidate = async (req, res, next) => {
  const payload = {
    firstName: req.body.firstName,
    middleName: req.body.middleName,
    lastName: req.body.lastName,
    email: req.body.email,
    gender: req.body.gender,
    DOB: req.body.DOB,
    role: req.body.role,
    joiningDate: req.body.joiningDate,
    totalExp: req.body.totalExp,

    collage: req.body.collage,
    highestQualification: req.body.highestQualification,
    university: req.body.university,
    knownTech: req.body.knownTech,

    secondaryEmail: req.body.secondaryEmail,
    contactNo: req.body.contactNo,
    houseNo: req.body.houseNo,
    addressLine1: req.body.addressLine1,
    addressLine2: req.body.addressLine2,
    landmark: req.body.landmark,
    state: req.body.state,
    pincode: req.body.pincode,
    city: req.body.city,
    country: req.body.country,

    previousEmployer: req.body.previousEmployer,
    employerAddress: req.body.employerAddress,
    workingTime: req.body.workingTime,
  };

  const { error } = validation.validate(payload);
  if (error) {
    res.status(406);
    errorResponse(req, res, "employee data validation error", 406, error.message);
  } else if (isValidTech(req.body.knownTech)) {
    errorResponse(req, res, "selected technology does not exists in system", 406);
  } else {
    next();
  }
}

const loginValidation = joi.object({
  email: joi.string().email().trim(true).required(),
  role: joi.string().trim(true).valid('ADMIN', 'DEV', 'PM', 'HR').required(),
  password: joi.string().trim(true).max(12).min(8).required(),
});

export const loginValidate = async (req, res, next) => {
  const payload = {
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
  }

  const { error } = loginValidation.validate(payload);
  if(error){
    errorResponse(req, res, "employee data validation error", 406, error.message);
  } else {
    next();
  }
}