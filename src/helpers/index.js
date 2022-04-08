import { Technology } from '../models';

export const successResponse = (req, res, data, code = 200) => res.send({
  code,
  data,
  success: true,
});

export const errorResponse = (
  req,
  res,
  errorMessage = 'Something went wrong',
  code = 500,
  error = {},
) => res.status(code).json({
  code,
  errorMessage,
  error,
  data: null,
  success: false,
});

export const createPassword = (dob) => {
  const date = new Date(dob).toISOString().split('T')[0].split('-').reverse().join('');
  return date;
};

export const getTimeBetweenDates = (startDate, endDate) => {
  const sDate = new Date(startDate);
  const eDate = new Date(endDate);
  let year = eDate.getFullYear() - sDate.getFullYear();
  let month = eDate.getMonth() - sDate.getMonth();
  if (month < 0) {
    year -= 1;
    month += 11;
  }
  return `${year} years, ${month + 1} months`;
};
export const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const isValidTech = async (arr) => {
  let techList = await Technology.findAll(
    {
      attributes: ['techName'],
    },
  );
  techList = techList.map(elem => elem.techName);
  return arr.every(elem => techList.includes(elem));
};

export const validateFields = (object, fields) => {
  const errors = [];
  fields.forEach((f) => {
    if (!(object && object[f])) {
      errors.push(f);
    }
  });
  return errors.length ? `${errors.join(', ')} are required fields.` : '';
};
