import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import { errorResponse, successResponse } from '../../helpers';
import { Leave, ProjectEmployee, Employee, DailyAttendance } from '../../models';
import transporter from '../../helpers/mail';
import * as constantVar from '../../constant/constantVar';

// difference between two dates
function getDates(startDate1, endDate2) {
  var oneDay = 24 * 3600 * 1000;
  for (var arrayDates = [], ms = startDate1 * 1, last = endDate2 * 1; ms < last; ms += oneDay) {
    arrayDates.push(new Date(ms));
  }
  arrayDates.push(new Date(ms + 1));
  return arrayDates;
}

// redering add leave page 
const leaveForm = async (req, res) => {
  res.render('add-leave', { success: '' });
};

// business logic of add leave for employee(DEV)
const addLeave = async (req, res) => {
  try {
    const devId = req.user.id;
    const {
      startDate, endDate, reason,
    } = req.body;
    const leavedata = {
      id: uuidv4(),
      employeeId: devId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      status: 'pending',
    };
    await Leave.create(leavedata);

    //to find respective PM of DEVELOPER
    let projectIdsFun = () => {
      return new Promise((resolve, reject) => {
        resolve(ProjectEmployee.findAll({ where: { employeeId: devId } }))
      }).then((result) => {
        let projectIds = result.map(element => element.projectId);
        return projectIds;
      })
    }
    let empIdsFun = (projectIds) => {
      return new Promise((resolve, reject) => {
        resolve(ProjectEmployee.findAll({ where: { projectId: projectIds } }))
      }).then((result) => {
        let empIds = result.map(element => element.employeeId);
        return empIds;
      })
    }
    let roleDataFun = (empIds) => {
      return new Promise((resolve, reject) => {
        resolve(Employee.findAll({ where: { id: empIds, role: constantVar.PM } }))
      }).then((result) => {
        let roleData = result.map(element => element.email);
        return roleData;
      })
    }
    const listPM = async () => {
      let projectIdData = await projectIdsFun();
      let empIdData = await empIdsFun(projectIdData);
      let roleDataPM = await roleDataFun(empIdData);
      return roleDataPM;
    }
    const roleData = await listPM();

    // let projectIds = await ProjectEmployee.findAll({ where: { employeeId: devId } });
    // projectIds = projectIds.map(element => element.projectId);
    // let empIds = await ProjectEmployee.findAll({ where: { projectId: projectIds } });
    // empIds = empIds.map(element => element.employeeId);
    // let roleData = await Employee.findAll({ where: { id: empIds, role: constantVar.PM } })
    // roleData = roleData.map(element => element.email);

    // to send leave request mail to all PM 
    roleData.forEach(element => {
      const mailOptions = {
        from: constantVar.MAIL_ID, // system address
        to: element,
        subject: 'Leave Request',
        text: `Employee ${req.user.email}, wants to take leave from ${leavedata.startDate},
        to ${leavedata.endDate} due to ${reason}`,
      };
      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          return errorResponse(req, res, err.message, 500);
        } else {
          return successResponse(req, res, getleave, 200);
        }
      });
    });

    // to show own leaves of employee(DEV)
    const getleave = await Leave.findAll({ where: { employeeId: devId, isArchived: false } });
    res.render('view-leave', { leavesdata: getleave, success: 'YOUR LEAVE SUCCESSFULLY ADDED!!' });
  } catch (e) {
    res.render('add-leave');
  }
};

//view all leave pages
const viewLeave = async (req, res) => {

  // role and userid from stored cookies
  const role = req.user.role;
  const userId = req.user.id;

  // if employee is developer
  if (role === constantVar.DEV) {
    try {

      // pagination
      const page = Number(req.query.page) || 0;
      const size = Number(req.query.size) || 12;
      const getleave = await Leave.findAndCountAll({
        where: { employeeId: userId, isArchived: false },
        limit: size,
        offset: page * size
      })
      const arrayLeave = getleave.rows;
      if (arrayLeave.length == 0) {
        res.render('view-leave', { leavesdata: arrayLeave, success: "" });
      } else {
        res.render('view-leave', { leavesdata: arrayLeave, success: "" });
      }
    } catch (e) {
      return errorResponse(req, res, e.message, 400, e);
    }
  }

  // if employee is Admin
  else if (role === constantVar.ADMIN) {
    try {

      // pagination
      const page = Number(req.query.page) || 0;
      const size = Number(req.query.size) || 12;
      const getleave = await Leave.findAndCountAll({
        include: [{
          model: Employee,
          attributes: ['firstName', 'lastName', 'email'],
        }],
        limit: size,
        offset: page * size
      })
      const arrayLeave = getleave.rows;
      if (arrayLeave.length == 0) {
        res.render('adminView-leave', { leavesdata: arrayLeave });
      } else {
        res.render('adminView-leave', { leavesdata: arrayLeave });
      }
    } catch (e) {
      return errorResponse(req, res, e.message, 400, e);
    }
  }

  // if employee is PM
  else if (role === constantVar.PM) {
    try {

      // pagination
      const page = Number(req.query.page) || 0;
      const size = Number(req.query.size) || 12;

      // to find developers who are working under PM
      let projectIdsFun = () => {
        return new Promise((resolve, reject) => {
          resolve(ProjectEmployee.findAll({ where: { employeeId: userId } }))
        }).then((result) => {
          let projectIds = result.map(element => element.projectId);
          return projectIds;
        })
      }
      let empIdsFun = (projectIds) => {
        return new Promise((resolve, reject) => {
          resolve(ProjectEmployee.findAll({ where: { projectId: projectIds } }))
        }).then((result) => {
          let empIds = result.map(element => element.employeeId);
          return empIds;
        })
      }
      const listEmp = async () => {
        let projectIdData = await projectIdsFun();
        let empIdData = await empIdsFun(projectIdData);
        return empIdData;
      }
      const empIds = await listEmp();

      // let projectIds = await ProjectEmployee.findAll({ where: { employeeId: userId } });
      // projectIds = projectIds.map(element => element.projectId);
      // let empIds = await ProjectEmployee.findAll({ where: { projectId: projectIds } });
      // empIds = empIds.map(element => element.employeeId);

      const getleave = await Leave.findAndCountAll({
        where: { employeeId: empIds, isArchived: false },
        include: [{
          model: Employee,
          attributes: ['firstName', 'lastName', 'email'],
        }],
        limit: size,
        offset: page * size
      })

      const arrayLeave = getleave.rows;
      if (arrayLeave.length == 0) {
        res.render('update-leave', { leavesdata: arrayLeave });
      } else {
        res.render('update-leave', { leavesdata: arrayLeave });
      }
    } catch (e) {
      return errorResponse(req, res, e.message, 400, e);
    }
  }

  // if employee is HR
  else if (role === constantVar.HR) {
    try {

      // pagination
      const page = Number(req.query.page) || 0;
      const size = Number(req.query.size) || 12;
      const getleave = await Leave.findAndCountAll({
        where: { isArchived: false },
        include: [{
          model: Employee,
          attributes: ['firstName', 'lastName', 'email'],
        }],
        limit: size,
        offset: page * size
      })
      const arrayLeave = getleave.rows;
      if (arrayLeave.length == 0) {
        res.render('hrView-leave', { leavesdata: arrayLeave });
      } else {
        res.render('hrView-leave', { leavesdata: arrayLeave });
      }
    } catch (e) {
      return errorResponse(req, res, e.message, 400, e);
    }
  }

};

// view own leave by id  
const viewOneLeave = async (req, res) => {

  // role from stored cookies
  const role = req.user.role;

  // if employee is developer
  if (role === constantVar.DEV) {
    try {
      const getleave = await Leave.findAll({ where: { id: req.params.id, isArchived: false } });
      res.render('view-leavedata', { leavesdata: getleave });
    } catch (e) {
      return errorResponse(req, res, e.message, 400, e);
    }
  }
  // if employee is Admin
  else if (role === constantVar.ADMIN) {
    try {
      const getleave = await Leave.findAll({ where: { id: req.params.id } });
      res.render('adminView-leave', { leavesdata: getleave });
    } catch (e) {
      return errorResponse(req, res, e.message, 400, e);
    }
  }
  // if employee is PM
  else if (role === constantVar.PM) {
    try {
      const getleave = await Leave.findAll({ where: { id: req.params.id, isArchived: false } });
      res.render('update-leave', { leavesdata: getleave });
    } catch (e) {
      return errorResponse(req, res, e.message, 400, e);
    }
  }
  // if employee is HR
  else if (role === constantVar.HR) {
    try {
      const getleave = await Leave.findAll({ where: { id: req.params.id, isArchived: false } });
      res.render('hrView-leave', { leavesdata: getleave });
    } catch (e) {
      return errorResponse(req, res, e.message, 400, e);
    }
  }
};

// update leave data for employee(DEV) 
const updateLeave = async (req, res) => {
  try {

    // devid from stored cookies
    const devId = req.user.id;
    let mailOptions = {};

    // to find one leave data 
    const getdata = await Leave.findByPk(req.params.id);
    const {
      startDate, endDate, reason, status, isArchived,
    } = req.body;
    const leavedata = {
      employeeId: getdata.employeeId,
      startDate,
      endDate,
      reason,
      status,
      isArchived,
    };

    // update leave details
    await Leave.update(leavedata, { where: { id: req.params.id } });

    // let projectIds = await ProjectEmployee.findAll({ where: { employeeId: devId } });
    // projectIds = projectIds.map(element => element.projectId);
    // let empIds = await ProjectEmployee.findAll({ where: { projectId: projectIds } });
    // empIds = empIds.map(element => element.employeeId);
    // let roleData = await Employee.findAll({ where: { id: empIds, role: constantVar.PM } })
    // roleData = roleData.map(element => element.email);

    //to find respective PM of DEVELOPER
    let projectIdsFun = () => {
      return new Promise((resolve, reject) => {
        resolve(ProjectEmployee.findAll({ where: { employeeId: devId } }))
      }).then((result) => {
        let projectIds = result.map(element => element.projectId);
        return projectIds;
      })
    }
    let empIdsFun = (projectIds) => {
      return new Promise((resolve, reject) => {
        resolve(ProjectEmployee.findAll({ where: { projectId: projectIds } }))
      }).then((result) => {
        let empIds = result.map(element => element.employeeId);
        return empIds;
      })
    }
    let roleDataFun = (empIds) => {
      return new Promise((resolve, reject) => {
        resolve(Employee.findAll({ where: { id: empIds, role: constantVar.PM } }))
      }).then((result) => {
        let roleData = result.map(element => element.email);
        return roleData;
      })
    }
    const listPM = async () => {
      let projectIdData = await projectIdsFun();
      let empIdData = await empIdsFun(projectIdData);
      let roleDataPM = await roleDataFun(empIdData);
      return roleDataPM;
    }
    const roleData = await listPM();
    roleData.forEach(element => {

      // to check if leave detail is not deleted by DEV
      if (leavedata.isArchived != 'on') {
        mailOptions = {
          from: constantVar.MAIL_ID, // system address
          to: element, // PM address
          subject: 'Leave Request Updated',
          text: `Employee ${req.user.email}, updated his/her leave from ${leavedata.startDate},
      to ${leavedata.endDate} due to ${reason}`,
        };
      }

      // if leave detail soft deleted by DEV
      else {
        mailOptions = {
          from: constantVar.MAIL_ID, // system address
          to: element, // PM address
          subject: 'Leave Request Updated',
          text: `Employee ${req.user.email} does not want to leave now!!!`,
        };
      }

      // to send mail to PM of updated details of leave
      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          return errorResponse(req, res, err.message, 500);
        } else {
          successResponse(req, res, getleave, 200);
        }
      });
    });

    // to fetch all detail of leave
    const getallleave = await Leave.findAll({ where: { employeeId: devId, isArchived: false } });
    res.render('view-leave', { leavesdata: getallleave, success: 'YOUR LEAVE DETAILS UPDATED!!!' });
  }
  catch (e) {
    return errorResponse(req, res, e.message, 400, e);
  }
};

// leave approve or reject by employee(PM)
const acceptRejectLeave = async (req, res) => {
  const leaveid = req.body;

  // to find leavedata of clicked button
  const getdata = await Leave.findAll({
    where: { id: leaveid.lid },
    include: [{
      model: Employee,
      attributes: ['firstName', 'lastName', 'email'],
    }],
  });

  let mailOptions = {};

  // to find mail id of developer to send approve or reject mail
  let devEmail = await Employee.findAll({
    where:
      { id: getdata[0].employeeId }
  });
  devEmail = devEmail.map(e => e.email);

  // if leave accepted by PM
  if (leaveid.action === 'accept') {
    const leavedata = {
      employeeId: getdata[0].employeeId,
      startDate: getdata[0].startDate,
      endDate: getdata[0].endDate,
      reason: getdata[0].reason,
      status: 'approved',
    };

    // start date and end date to find inbetween dates
    var sDate = getdata[0].startDate;
    var eDate = getdata[0].endDate;
    const datesDiff = getDates(sDate, eDate);

    // set isOnLeave: true on all leave days(dates)
    datesDiff.forEach(async (date) => {
      await DailyAttendance.findOrCreate({
        where: {
          [Op.and]: [
            { employeeId: getdata[0].employeeId },
            { date: date.getDate() },
            { month: date.getMonth() },
            { year: date.getFullYear() }],
        },
        defaults: {
          id: uuidv4(),
          employeeId: getdata[0].employeeId,
          log: [],
          date: date.getDate(),
          month: date.getMonth(),
          year: date.getFullYear(),
          isOnLeave: true,
        },
      });
    });

    // status update with approved
    await Leave.update(leavedata, { where: { id: leaveid.lid } });
    mailOptions = {
      from: constantVar.MAIL_ID, // system address
      to: devEmail[0], // developer's address
      subject: 'Leave Request',
      text: 'YOUR LEAVE IS APPROVED!!!',
    };
  }
  // if leave rejected by PM 
  else if (leaveid.action === 'reject') {
    const leavedata = {
      employeeId: getdata[0].employeeId,
      startDate: getdata[0].startDate,
      endDate: getdata[0].endDate,
      reason: getdata[0].reason,
      status: 'rejected',
    };

    // status update with rejected
    const getleave = await Leave.update(leavedata, { where: { id: leaveid.lid } });
    mailOptions = {
      from: constantVar.MAIL_ID, // system address
      to: devEmail[0], // developer's address
      subject: 'Leave Request',
      text: 'YOUR LEAVE IS REJECTED!!!',
    };
  }

  // send mail to employee(DEV) of approved or rejected leave
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return errorResponse(req, res, err.message, 500);
    } else {
      return successResponse(req, res, leaveid.lid, 200);
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

