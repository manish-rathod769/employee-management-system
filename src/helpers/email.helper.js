import sendgrid from '@sendgrid/mail';

export const sendRegistrationMail = (employee, password) => {
  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: employee.email,
    from: process.env.EMAIL,
    subject: 'registration ',
    text: 'your account has been created!!',
    html: ` <p> hello </p><strong> ${employee.firstName}, </strong> </br>
            <p> you are registered with ems. your password and user name are given below.</p> </br>
            <strong>user name: </strong> <p> ${employee.email} </p> </br>
            <strong> password: </strong> <p> ${password} </p> </br>
            <p> this is auto generated password after first log-in please change passwod. </p>`,
  };
  sendgrid.send(msg)
    .then(resp => resp)
    .catch(error => error);
};

export const sendForgotPasswordMail = (employee, password) => {
  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: employee.email,
    from: process.env.EMAIL,
    subject: 'registration ',
    text: 'your account has been created!!',
    html: ` <p> hello </p><strong> ${employee.firstName}, </strong> </br>
            <p> your new password and user name are given below.</p> </br>
            <strong>user name: </strong> <p> ${employee.email} </p> </br>
            <strong> password: </strong> <p> ${password} </p> </br>
            <p> this is auto generated password after log-in please change passwod. </p>`,
  };
  sendgrid.send(msg)
    .then(resp => resp)
    .catch(error => error);
};
