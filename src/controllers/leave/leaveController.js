import { v4 as uuidv4 } from 'uuid';
import { errorResponse, successResponse } from '../../helpers';
import { Leave } from '../../models';
exports.addLeave = async (req, res) => {
    try {
        console.log("leave controller adds")
        const { employeeId, startDate, endDate, reason } = req.body;
        console.log(employeeId, startDate, endDate, reason);
        const leavedata = {
            id: uuidv4(),
            employeeId: 123,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            reason,
            status: 'pending',
            isArchive: false,
        }
        console.log(leavedata)
        const leaveobj = await Leave.create(leavedata);
        console.log(leaveobj)
        //  successResponse(req, res, leaveobj, 200);
        res.redirect('/view/leave');
    } catch (e) {
        //   errorResponse(req, res, e.message, 400, e);     
        res.redirect('/add-leave');
    }

}

exports.viewLeave = async (req, res) => {
    try {

    
            const getleave = await Leave.findAll({ where: {isArchive : false } });
            console.log(getleave);
            res.render('view-leave', { leavesdata: getleave });
        //    successResponse(req, res, getleave, 200);
        //==============================


        //=======================admin view
        // const id = req.params.id;
        // console.log(id);
        // if (id) {
        //     const getleave = await Leave.findByPk(id);
        //     //  const getleave = await Leave.findAll({ where: { id: id, isArchive : false } });
        //     console.log(getleave)
        //     successResponse(req, res, getleave, 200);
        // } else {
        //     const getleave = await Leave.findAll({ where: { isArchive : false } });
        //     console.log(getleave)
        //     successResponse(req, res, getleave, 200);
        // }
        //============================
    } catch (e) {
        errorResponse(req, res, e.message, 400, e);
    }
}

exports.deleteLeave = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id);
        const getdata = await Leave.findByPk(id);

        let leavedata = {
            employeeId: getdata.employeeId,
            startDate: getdata.startDate,
            endDate: getdata.endDate,
            reason: getdata.reason,
            status: getdata.reason,
            remainingLeave: getdata.reason,
            isArchive: true,
        }

        const getleave = await Leave.update(leavedata, { where: { id: id } })
        //const getleave = await Leave.destroy({ where: { id: id } })
        console.log(getleave)
        successResponse(req, res, getleave, 200);
    }
    catch (e) {
        errorResponse(req, res, e.message, 400, e);
    }
}

exports.updateLeave = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id);
        const getdata = await Leave.findByPk(id);
        console.log(getdata.startDate);
        const { employeeId, startDate, endDate, reason, status, remainingLeave } = req.body;
        console.log(employeeId, startDate, endDate, reason, status, remainingLeave);
        let leavedata = {}
        if (!startDate && !endDate) {
            leavedata = {
                employeeId: getdata.employeeId,
                startDate: getdata.startDate,
                endDate: getdata.endDate,
                reason,
                status,
                remainingLeave,
            }
        } else if (!startDate && endDate) {
            leavedata = {
                employeeId: getdata.employeeId,
                startDate: getdata.startDate,
                endDate: new Date(endDate),
                remainingLeave,
                reason,
                status,
            }
        } else if (startDate && !endDate) {
            leavedata = {
                employeeId: getdata.employeeId,
                startDate: new Date(startDate),
                endDate: getdata.endDate,
                remainingLeave,
                reason,
                status,
            }
        } else {
            leavedata = {
                employeeId: getdata.employeeId,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                remainingLeave,
                reason,
                status,
            }
        }
        console.log(leavedata)
        const getleave = await Leave.update(leavedata, { where: { id: id } })
        console.log(getleave)
        successResponse(req, res, getleave, 200);
    }
    catch (e) {
        errorResponse(req, res, e.message, 400, e);
    }
}


exports.leaveForm = async (req, res) => {
    res.render('add-leave');

} 