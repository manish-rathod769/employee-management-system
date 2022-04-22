import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import { errorResponse, successResponse } from '../../helpers';
import { Leave, ProjectEmployee, Employee, DailyAttendance } from '../../models';
import transporter from '../../helpers/mail';

const leaveForm = async (req, res) => {
  res.render('add-leave', { success: '' });
};

const addLeave = async (req, res) => {
  try {
    const devId = req.user.id;
    const {
      employeeId, startDate, endDate, reason,
    } = req.body;
    const leavedata = {
      id: uuidv4(),
      employeeId: devId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      status: 'pending',
    };
    const leaveobj = await Leave.create(leavedata);
    let projectIds = await ProjectEmployee.findAll({ where: { employeeId: devId } });
    projectIds = projectIds.map(element => element.projectId);
    let empIds = await ProjectEmployee.findAll({ where: { projectId: projectIds } });
    empIds = empIds.map(element => element.employeeId);
    let roleData = await Employee.findAll({ where: { id: empIds, role: 'PM' } })
    roleData = roleData.map(element => element.email);
    console.log(roleData);
    roleData.forEach(element => {
      const mailOptions = {
        from: "noreply_mail<noreply@someemail.com>", // system address
        to: element,
        subject: 'Leave Request',
        text: `Employee ${req.user.email}, wants to take leave from ${leavedata.startDate},
        to ${leavedata.endDate} due to ${reason}`,
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          return err;
        } // else {
        //   return successResponse(req, res, getleave, 200);
        // }
      });
    });
    const getleave = await Leave.findAll({ where: { employeeId: devId, isArchived: false } });
    res.render('view-leave', { leavesdata: getleave, success: 'YOUR LEAVE SUCCESSFULLY ADDED!!' });
  } catch (e) {
    res.render('add-leave');
  }
};

const viewLeave = async (req, res) => {
  const role = req.user.role;
  const userId = req.user.id;
  if (role === 'DEV') {
    try {
      let page = Number(req.query.page) || 0;
      let size = Number(req.query.size) || 12;
      const getleave = await Leave.findAndCountAll({
        where: { employeeId: userId, isArchived: false },
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
      console.log(e)
      errorResponse(req, res, e.message, 400, e);
    }
  } else if (role === 'ADMIN') {
    try {
      let page = Number(req.query.page) || 0;
      let size = Number(req.query.size) || 12;
      const getleave = await Leave.findAndCountAll({
        include: [{
          model: Employee,
          attributes: ['firstName', 'lastName', 'email'],
        }],
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
      let projectIds = await ProjectEmployee.findAll({ where: { employeeId: userId } });
      projectIds = projectIds.map(element => element.projectId);
      let empIds = await ProjectEmployee.findAll({ where: { projectId: projectIds } });
      empIds = empIds.map(element => element.employeeId);
      const getleave = await Leave.findAndCountAll({
        where: { employeeId: empIds, isArchived: false },
        include: [{
          model: Employee,
          attributes: ['firstName', 'lastName', 'email'],
        }],
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
        include: [{
          model: Employee,
          attributes: ['firstName', 'lastName', 'email'],
        }],
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
  const role = req.user.role;
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
    const devId = req.user.id;
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
    let projectIds = await ProjectEmployee.findAll({ where: { employeeId: devId } });
    projectIds = projectIds.map(element => element.projectId);
    let empIds = await ProjectEmployee.findAll({ where: { projectId: projectIds } });
    empIds = empIds.map(element => element.employeeId);
    let roleData = await Employee.findAll({ where: { id: empIds, role: 'PM' } })
    roleData = roleData.map(element => element.email);
    roleData.forEach(element => {
      if (leavedata.isArchived != 'on') {
        mailOptions = {
          from: "noreply_mail<noreply@someemail.com>", // system address
          to: element,
          subject: 'Leave Request Updated',
          text: `Employee ${req.user.email}, updated his/her leave from ${leavedata.startDate},
      to ${leavedata.endDate} due to ${reason}`,
        };
      }
      else {
        mailOptions = {
          from: "noreply_mail<noreply@someemail.com>", // system address
          to: element,
          subject: 'Leave Request Updated',
          text: `Employee ${req.user.email} does not want to leave now!!!`,
        };
      }
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          return err;
        } // else {
        //   successResponse(req, res, getleave, 200);
        // }
      });
    });
    const getallleave = await Leave.findAll({ where: { employeeId: devId, isArchived: false } });
    res.render('view-leave', { leavesdata: getallleave, success: 'YOUR LEAVE DETAILS UPDATED!!!' });
  }
  catch (e) {
    errorResponse(req, res, e.message, 400, e);
  }
};


// pm---------------------------------------------------------------------------------------------------------------------------------------------------

const acceptRejectLeave = async (req, res) => {
  const leaveid = req.body;
  const getdata = await Leave.findAll({ 
    where: { id: leaveid.lid } ,
    include: [{
      model: Employee,
      attributes: ['firstName', 'lastName', 'email'],
    }],
  });
  let mailOptions = {};
  let devEmail = await Employee.findAll({ where: { id: getdata[0].employeeId } });
  devEmail = devEmail.map(e => e.email);
  if (leaveid.action === 'accept') {
    const leavedata = {
      employeeId: getdata[0].employeeId,
      startDate: getdata[0].startDate,
      endDate: getdata[0].endDate,
      reason: getdata[0].reason,
      status: 'approved',
    };
<<<<<<< HEAD
<<<<<<< HEAD
    
=======

>>>>>>> edit: daily Attendance isOnLeave:true(leave)
=======
    
>>>>>>> edit: daily Attendance isOnLeave:true(leave)
    var sDate = getdata[0].startDate;
    var eDate = getdata[0].endDate;
    function getDates(d1, d2) {
      var oneDay = 24 * 3600 * 1000;
      for (var d = [], ms = d1 * 1, last = d2 * 1; ms < last; ms += oneDay) {
        d.push(new Date(ms));
      }
      d.push(new Date(ms + 1));
      return d;
    }
    const dates = getDates(sDate, eDate);
    dates.forEach(async (date) => {
      const attendance = await DailyAttendance.create({
        id: uuidv4(),
        employeeId: getdata[0].employeeId,
        log: [{ 'start': '', 'end': '' }],
        date: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        isOnLeave: true,
      });
    });
    const getleave = await Leave.update(leavedata, { where: { id: leaveid.lid } });
    mailOptions = {
      from: "noreply_mail<noreply@someemail.com>", // system address
      to: devEmail[0], // developer's address
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
      to: devEmail[0], // developer's address
      subject: 'Leave Request',
      text: 'YOUR LEAVE IS REJECTED!!!',
    };
  }
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return errorResponse(req, res, err.message, 500);
    } else {
      console.log(leaveid.lid)
      successResponse(req, res, leaveid.lid, 200);
    }
  });
};

module.exports = {
  addLeave,
  viewLeave,
  viewOneLeave,
  updateLeave,
  acceptRejectLeave,
  leaveForm,
};

