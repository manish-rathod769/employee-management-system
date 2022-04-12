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
      isArchive: false,
    };
    console.log(leavedata);
    const leaveobj = await Leave.create(leavedata);
    console.log(leaveobj);
    const mailOptions = {
      from: 'apexapatel27321@gmail.com', // sender address
      to: 'apexapatel27321@gmail.com', // list of receivers
      subject: 'Leave Request',
      text: `Employee ${leavedata.employeeId}, wants to take leave from ${leavedata.startDate},
      to ${leavedata.endDate} due to ${reason}`,
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });

    const getleave = await Leave.findAll({ where: { employeeId: '123', isArchive: false } });
    console.log(getleave);
    res.render('view-leave', { leavesdata: getleave, success: 'YOUR LEAVE SUCCESSFULLY ADDED!!' });
  } catch (e) {
    //   errorResponse(req, res, e.message, 400, e);
    res.render('add-leave');
  }
};

const viewLeave = async (req, res) => {
  try {
    const getleave = await Leave.findAll({ where: { isArchive: false } });
    console.log(getleave);
    res.render('view-leave', { leavesdata: getleave });
  } catch (e) {
    errorResponse(req, res, e.message, 400, e);
  }
};

const viewOwnLeave = async (req, res) => {
  try {
    const getleave = await Leave.findAll({ where: { id: req.params.id, isArchive: false } });
    console.log(getleave);
    res.render('view-leavedata', { leavesdata: getleave });
  } catch (e) {
    errorResponse(req, res, e.message, 400, e);
  }
};

const adminViewLeave = async (req, res) => {
  if (req.params.id) {
    const getleave = await Leave.findAll({ where: { id: req.params.id } });
    //  const getleave = await Leave.findAll({ where: { id: id, isArchive : false } });
    console.log(getleave);
    res.render('adminView-leave', { leavesdata: getleave });
  } else {
    const getleave = await Leave.findAll({});
    console.log(getleave);
    res.render('adminView-leave', { leavesdata: getleave });
  }
};

// const deleteLeave = async (req, res) => {
//   try {
//     const leavedata = await Leave.update(
//       { isArchive: true }, { returning: true, where: { id: req.params.id } },
//     );
//     console.log(leavedata);
//     const getleave = await Leave.findAll({ where: { isArchive: false } });
//     console.log(getleave);
//     res.render('view-leave', { leavesdata: getleave, success: 'YOUR LEAVE IS DELETED!!!' });
//     // successResponse(req, res, getleave, 200);
//   } catch (e) {
//     errorResponse(req, res, e.message, 400, e);
//   }
// };

const updateLeave = async (req, res) => {
  try {
    const getdata = await Leave.findByPk(req.params.id);
    const {
      employeeId, startDate, endDate, reason, status, remainingLeave, isArchive,
    } = req.body;
    console.log(employeeId, startDate, endDate, reason, status, remainingLeave, isArchive);
    let leavedata = {};
    // if (!startDate && !endDate) {
    //   leavedata = {
    //     employeeId: getdata.employeeId,
    //     startDate: getdata.startDate,
    //     endDate: getdata.endDate,
    //     reason,
    //     status,
    //     remainingLeave,
    //   };
    // } else if (!startDate && endDate) {
    //   leavedata = {
    //     employeeId: getdata.employeeId,
    //     startDate: getdata.startDate,
    //     endDate: new Date(endDate),
    //     remainingLeave,
    //     reason,
    //     status,
    //   };
    // } else if (startDate && !endDate) {
    //   leavedata = {
    //     employeeId: getdata.employeeId,
    //     startDate: new Date(startDate),
    //     endDate: getdata.endDate,
    //     remainingLeave,
    //     reason,
    //     status,
    //   };
    // } else {
    //   leavedata = {
    //     employeeId: getdata.employeeId,
    //     startDate: new Date(startDate),
    //     endDate: new Date(endDate),
    //     remainingLeave,
    //     reason,
    //     status,
    //   };
    // }
    leavedata = {
      employeeId: getdata.employeeId,
      startDate,
      endDate,
      reason,
      status,
      remainingLeave,
      isArchive,
    };
    console.log(leavedata);
    const getleave = await Leave.update(leavedata, { where: { id: req.params.id } });
    console.log(getleave);
    const getallleave = await Leave.findAll({ where: { isArchive: false } });
    console.log(getallleave);
    res.render('view-leave', { leavesdata: getallleave, success: 'YOUR LEAVE DETAILS UPDATED!!!' });
    // successResponse(req, res, getleave, 200);
  } catch (e) {
    errorResponse(req, res, e.message, 400, e);
  }
};

const viewLeaves = async (req, res) => {
  const getleave = await Leave.findAll({ where: { employeeId: '123', isArchive: false } });
  console.log(getleave);
  res.render('update-leave', { leavesdata: getleave });
};

const acceptLeaves = async (req, res) => {
  const getdata = await Leave.findAll({ where: { id: req.params.id } });
  console.log(getdata);
  const leavedata = {
    employeeId: getdata[0].employeeId,
    startDate: getdata[0].startDate,
    endDate: getdata[0].endDate,
    reason: getdata[0].reason,
    status: 'approved',
    remainingLeave: getdata[0].remainingLeave,
  };
  console.log(leavedata);
  const getleave = await Leave.update(leavedata, { where: { id: req.params.id } });
  console.log(getleave);
  const mailOptions = {
    from: 'apexapatel27321@gmail.com', // sender address
    to: 'apexapatel27321@gmail.com', // list of receivers
    subject: 'Leave Request',
    text: 'YOUR LEAVE IS APPROVED!!!',
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });

  const viewleave = await Leave.findAll({ where: { employeeId: '123', isArchive: false } });
  console.log(viewleave);
  res.render('update-leave', { leavesdata: viewleave });
};

const rejectLeaves = async (req, res) => {
  const getdata = await Leave.findAll({ where: { id: req.params.id } });
  console.log(getdata);
  const leavedata = {
    employeeId: getdata[0].employeeId,
    startDate: getdata[0].startDate,
    endDate: getdata[0].endDate,
    reason: getdata[0].reason,
    status: 'rejected',
    remainingLeave: getdata[0].remainingLeave,
  };
  console.log(leavedata);
  const getleave = await Leave.update(leavedata, { where: { id: req.params.id } });
  console.log(getleave);
  const mailOptions = {
    from: 'apexapatel27321@gmail.com', // sender address
    to: 'apexapatel27321@gmail.com', // list of receivers
    subject: 'Leave Request',
    text: 'YOUR LEAVE IS REJECTED!!!',
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
  const viewleave = await Leave.findAll({ where: { employeeId: '123', isArchive: false } });
  console.log(viewleave);
  res.render('update-leave', { leavesdata: viewleave });
};
module.exports = {
  addLeave,
  viewLeave,
  viewOwnLeave,
  updateLeave,
  acceptLeaves,
  rejectLeaves,
  viewLeaves,
  leaveForm,
  adminViewLeave,
};
