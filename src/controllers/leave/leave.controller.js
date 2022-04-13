import { v4 as uuidv4 } from 'uuid';
import { errorResponse } from '../../helpers';
import { Leave } from '../../models';
import transporter from '../../helper/mail';

const leaveForm = async (req, res) => {
  res.render('add-leave', { success: '' });
};

const addLeave = async (req, res) => {
  try {
    const {
      employeeId, startDate, endDate, reason,
    } = req.body;
    console.log(employeeId, startDate, endDate, reason);
    const leavedata = {
      id: uuidv4(),
      employeeId: 123,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      status: 'pending',
    };
    console.log(leavedata);
    const leaveobj = await Leave.create(leavedata);
    console.log(leaveobj);
    const mailOptions = {
      from: "noreply_mail<noreply@someemail.com>", // system address
      // to: ['apexapatel27321@gmail.com','chavan.vinayak017@gmail.com'], // list of pm
      to: "apexasavaliya27321@gmail.com",
      subject: 'Leave Request',
      text: `Employee ${leavedata.employeeId}, wants to take leave from ${leavedata.startDate},
      to ${leavedata.endDate} due to ${reason}`,
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
       errorResponse(req, res, e.message, 400, err);
     } else {
       successResponse(req, res, getleave, 200);
     }
    });

    const getleave = await Leave.findAll({ where: { employeeId: '123', isArchived: false } });
    console.log(getleave);
    res.render('view-leave', { leavesdata: getleave, success: 'YOUR LEAVE SUCCESSFULLY ADDED!!' });
  } catch (e) {
    //   errorResponse(req, res, e.message, 400, e);
    res.render('add-leave');
  }
};

const viewLeave = async (req, res) => {
  const role = 'DEV';
  if (role === 'DEV') {
    try {
      const getleave = await Leave.findAll({ where: { employeeId: '123', isArchived: false } });
      console.log(getleave);
      res.render('view-leave', { leavesdata: getleave });
    } catch (e) {
      errorResponse(req, res, e.message, 400, e);
    }
  } else if (role === 'ADMIN') {
    try {
      const getleave = await Leave.findAll({});
      console.log(getleave);
      res.render('adminView-leave', { leavesdata: getleave });
    } catch (e) {
      errorResponse(req, res, e.message, 400, e);
    }
  } else if (role === 'PM') {
    try {
      const getleave = await Leave.findAll({ where: { employeeId: '123', isArchived: false } });
      console.log(getleave);
      res.render('update-leave', { leavesdata: getleave });
    } catch (e) {
      errorResponse(req, res, e.message, 400, e);
    }
  } else if (role === 'HR') {
    try {
      const getleave = await Leave.findAll({ where: { isArchived: false } });
      console.log(getleave);
      res.render('hrView-leave', { leavesdata: getleave });
    } catch (e) {
      errorResponse(req, res, e.message, 400, e);
    }
  }

};

const viewOneLeave = async (req, res) => {
  const role = 'PM';
  if (role === 'DEV') {
    try {
      const getleave = await Leave.findAll({ where: { id: req.params.id, isArchived: false } });
      console.log(getleave);
      res.render('view-leavedata', { leavesdata: getleave });
    } catch (e) {
      errorResponse(req, res, e.message, 400, e);
    }
  } else if (role === 'ADMIN') {
    try {
      const getleave = await Leave.findAll({ where: { id: req.params.id } });
      console.log(getleave);
      res.render('adminView-leave', { leavesdata: getleave });
    } catch (e) {
      errorResponse(req, res, e.message, 400, e);
    }
  } else if (role === 'PM') {
    try {
      const getleave = await Leave.findAll({ where: { id: req.params.id, isArchived: false } });
      console.log(getleave);
      res.render('update-leave', { leavesdata: getleave });
    } catch (e) {
      errorResponse(req, res, e.message, 400, e);
    }
  } else if (role === 'HR') {
    try {
      const getleave = await Leave.findAll({ where: { id: req.params.id, isArchived: false } });
      console.log(getleave);
      res.render('hrView-leave', { leavesdata: getleave });
    } catch (e) {
      errorResponse(req, res, e.message, 400, e);
    }
  }
};

const updateLeave = async (req, res) => {
  try {
    const getdata = await Leave.findByPk(req.params.id);
    const {
      employeeId, startDate, endDate, reason, status, isArchived,
    } = req.body;
    console.log(employeeId, startDate, endDate, reason, status, isArchived);
    const leavedata = {
      employeeId: getdata.employeeId,
      startDate,
      endDate,
      reason,
      status,
      isArchived,
    };
    console.log(leavedata);
    const getleave = await Leave.update(leavedata, { where: { id: req.params.id } });
    console.log(getleave);
    const mailOptions = {
      from: "noreply_mail<noreply@someemail.com>", // system address
      // to: ['apexapatel27321@gmail.com','chavan.vinayak017@gmail.com'], // list of pm
      to: "apexasavaliya27321@gmail.com",
      subject: 'Leave Request Updated',
      text: `Employee ${leavedata.employeeId}, updated his/her leave from ${leavedata.startDate},
      to ${leavedata.endDate} due to ${reason}`,
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        errorResponse(req, res, e.message, 400, err);
      } else {
        successResponse(req, res, getleave, 200);
      }
    });
    const getallleave = await Leave.findAll({ where: { isArchived: false } });
    console.log(getallleave);
    res.render('view-leave', { leavesdata: getallleave, success: 'YOUR LEAVE DETAILS UPDATED!!!' });
    // successResponse(req, res, getleave, 200);
  } catch (e) {
    errorResponse(req, res, e.message, 400, e);
  }
};


// pm---------------------------------------------------------------------------------------------------------------------------------------------------

const acceptRejectLeave = async (req, res) => {
  const leaveid = req.body;
  const getdata = await Leave.findAll({ where: { id: leaveid.lid } });
  console.log(getdata);
  let mailOptions = {};
  if (leaveid.action === 'accept') {
    const leavedata = {
      employeeId: getdata[0].employeeId,
      startDate: getdata[0].startDate,
      endDate: getdata[0].endDate,
      reason: getdata[0].reason,
      status: 'approved',
    };
    console.log(leavedata);
    const getleave = await Leave.update(leavedata, { where: { id: leaveid.lid } });
    console.log(getleave);
    mailOptions = {
      from: "noreply_mail<noreply@someemail.com>", // system address
      to: 'apexapatel27321@gmail.com', // developer's address
      subject: 'Leave Request',
      text: 'YOUR LEAVE IS APPROVED!!!',
    };
  } else if (leaveid.action === 'reject') {
    const leavedata = {
      employeeId: getdata[0].employeeId,
      startDate: getdata[0].startDate,
      endDate: getdata[0].endDate,
      reason: getdata[0].reason,
      status: 'rejected',
    };
    console.log(leavedata);
    const getleave = await Leave.update(leavedata, { where: { id: leaveid.lid } });
    console.log(getleave);
    mailOptions = {
      from: "noreply_mail<noreply@someemail.com>", // system address
      to: 'apexapatel27321@gmail.com', // developer's address
      subject: 'Leave Request',
      text: 'YOUR LEAVE IS REJECTED!!!',
    };
  }
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      errorResponse(req, res, e.message, 400, err);
    } else {
      successResponse(req, res, getleave, 200);
    }
  });
  const viewleave = await Leave.findAll({ where: { employeeId: '123', isArchived: false } });
  console.log(viewleave);
  res.render('update-leave', { leavesdata: viewleave });
};

module.exports = {
  addLeave,
  viewLeave,
  viewOneLeave,
  updateLeave,
  acceptRejectLeave,
  leaveForm,
};
