import { v4 as uuidv4 } from 'uuid';
import { errorResponse, successResponse } from '../../helpers';
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
    const leavedata = {
      id: uuidv4(),
      employeeId: 123,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      status: 'pending',
    };
    const leaveobj = await Leave.create(leavedata);
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
      let page = Number(req.query.page) || 0;
      let size = Number(req.query.size) || 12;
      const getleave = await Leave.findAndCountAll({
        where: { employeeId: '123', isArchived: false },
        limit: size,
        offset: page * size
      })
      const arr = getleave.rows;
      if (arr.length == 0) {
        res.render('view-leave', { leavesdata: arr, success: "" });
      } else {
        res.render('view-leave', { leavesdata: arr, success: "" });
      }
    } catch (e) {
      errorResponse(req, res, e.message, 400, e);
    }
  } else if (role === 'ADMIN') {
    try {
      let page = Number(req.query.page) || 0;
      let size = Number(req.query.size) || 12;
      const getleave = await Leave.findAndCountAll({
        limit: size,
        offset: page * size
      })
      const arr = getleave.rows;
      if (arr.length == 0) {
        res.render('adminView-leave', { leavesdata: arr });
      } else {
        res.render('adminView-leave', { leavesdata: arr });
      }
    } catch (e) {
      errorResponse(req, res, e.message, 400, e);
    }
  } else if (role === 'PM') {
    try {
      let page = Number(req.query.page) || 0;
      let size = Number(req.query.size) || 12;
      const getleave = await Leave.findAndCountAll({
        where: { employeeId: '123', isArchived: false },
        limit: size,
        offset: page * size
      })
      const arr = getleave.rows;
      if (arr.length == 0) {
        res.render('update-leave', { leavesdata: arr });
      } else {
        res.render('update-leave', { leavesdata: arr });
      }
    } catch (e) {
      errorResponse(req, res, e.message, 400, e);
    }
  } else if (role === 'HR') {
    try {
      let page = Number(req.query.page) || 0;
      let size = Number(req.query.size) || 12;
      const getleave = await Leave.findAndCountAll({
        where: { isArchived: false },
        limit: size,
        offset: page * size
      })
      const arr = getleave.rows;
      if (arr.length == 0) {
        res.render('hrView-leave', { leavesdata: arr });
      } else {
        res.render('hrView-leave', { leavesdata: arr });
      }
    } catch (e) {
      errorResponse(req, res, e.message, 400, e);
    }
  }

};

const viewOneLeave = async (req, res) => {
  const role = 'DEV';
  if (role === 'DEV') {
    try {
      console.log(req.params.id)
      const getleave = await Leave.findAll({ where: { id: req.params.id, isArchived: false } });
      console.log(getleave)
      res.render('view-leavedata', { leavesdata: getleave });
    } catch (e) {
      errorResponse(req, res, e.message, 400, e);
    }
  } else if (role === 'ADMIN') {
    try {
      const getleave = await Leave.findAll({ where: { id: req.params.id } });
      res.render('adminView-leave', { leavesdata: getleave });
    } catch (e) {
      errorResponse(req, res, e.message, 400, e);
    }
  } else if (role === 'PM') {
    try {
      const getleave = await Leave.findAll({ where: { id: req.params.id, isArchived: false } });
      res.render('update-leave', { leavesdata: getleave });
    } catch (e) {
      errorResponse(req, res, e.message, 400, e);
    }
  } else if (role === 'HR') {
    try {
      const getleave = await Leave.findAll({ where: { id: req.params.id, isArchived: false } });
      res.render('hrView-leave', { leavesdata: getleave });
    } catch (e) {
      errorResponse(req, res, e.message, 400, e);
    }
  }
};

const updateLeave = async (req, res) => {
  try {
    let mailOptions = {};
    const getdata = await Leave.findByPk(req.params.id);
    const {
      employeeId, startDate, endDate, reason, status, isArchived,
    } = req.body;
    const leavedata = {
      employeeId: getdata.employeeId,
      startDate,
      endDate,
      reason,
      status,
      isArchived,
    };
    const getleave = await Leave.update(leavedata, { where: { id: req.params.id } });
    if (leavedata.isArchived != 'on') {
      mailOptions = {
        from: "noreply_mail<noreply@someemail.com>", // system address
        // to: ['apexapatel27321@gmail.com','chavan.vinayak017@gmail.com'], // list of pm
        to: "apexasavaliya27321@gmail.com",
        subject: 'Leave Request Updated',
        text: `Employee ${leavedata.employeeId}, updated his/her leave from ${leavedata.startDate},
      to ${leavedata.endDate} due to ${reason}`,
      };
    }
    else {
      mailOptions = {
        from: "noreply_mail<noreply@someemail.com>", // system address
        // to: ['apexapatel27321@gmail.com','chavan.vinayak017@gmail.com'], // list of pm
        to: "apexasavaliya27321@gmail.com",
        subject: 'Leave Request Updated',
        text: `Employee ${leavedata.employeeId} does not want to leave now!!!`,
      };
    }
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        errorResponse(req, res, e.message, 400, err);
      } else {
        successResponse(req, res, getleave, 200);
      }
    });
    const getallleave = await Leave.findAll({ where: { isArchived: false } });
    res.render('view-leave', { leavesdata: getallleave, success: 'YOUR LEAVE DETAILS UPDATED!!!' });
  }
  catch (e) {
    errorResponse(req, res, e.message, 400, e);
  }
};


// pm---------------------------------------------------------------------------------------------------------------------------------------------------

const acceptRejectLeave = async (req, res) => {
  const leaveid = req.body;
  const getdata = await Leave.findAll({ where: { id: leaveid.lid } });
  let mailOptions = {};
  if (leaveid.action === 'accept') {
    const leavedata = {
      employeeId: getdata[0].employeeId,
      startDate: getdata[0].startDate,
      endDate: getdata[0].endDate,
      reason: getdata[0].reason,
      status: 'approved',
    };
    const getleave = await Leave.update(leavedata, { where: { id: leaveid.lid } });
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
    const getleave = await Leave.update(leavedata, { where: { id: leaveid.lid } });
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
