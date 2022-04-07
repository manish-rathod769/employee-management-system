import { v4 as uuidv4 } from 'uuid';
import { errorResponse, successResponse } from '../../helpers';
import { Leave } from '../../models';
exports.addLeave = async (req, res) => {
    try {
        const { employeeId, startDate, endDate, reason } = req.body;
        console.log(employeeId, startDate, endDate, reason);
        const leavedata = {
            id: uuidv4(),
            employeeId,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            reason,
            isArchive: false,
        }
        console.log(leavedata)
        const leaveobj = await Leave.create(leavedata);
        console.log(leaveobj)
        successResponse(req, res, leaveobj, 200);
    } catch (e) {
        errorResponse(req, res, e.message, 400, e);
    }

}

exports.viewLeave = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id);
        if (id) {
            const getleave = await Leave.findByPk(id);
            //  const getleave = await Leave.findAll({ where: { id: id } });
            console.log(getleave)
            successResponse(req, res, getleave, 200);
        } else {
            const getleave = await Leave.findAll();
            console.log(getleave)
            successResponse(req, res, getleave, 200);
        }
    } catch (e) {
        errorResponse(req, res, e.message, 400, e);
    }
}

exports.deleteLeave = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id);
        const getleave = await Leave.destroy({ where: { id: id } })
        console.log(getleave)
        successResponse(req, res, getleave, 200);
    }
    catch (e) {
        errorResponse(req, res, e.message, 400, e);
    }
}

exports.updateLeave = async (req, res) => {
    try{
        const id = req.params.id;
        console.log(id);
        const getdata = await Leave.findByPk(id);
        console.log(getdata.startDate);
        const { employeeId, startDate, endDate, reason, status, remainingLeave } = req.body;
        console.log(employeeId, startDate, endDate, reason, status, remainingLeave );
        let leavedata = {}
        if(!startDate && !endDate){
            leavedata = {
                startDate: getdata.startDate,
                endDate: getdata.endDate,
                reason,
                status,
                remainingLeave,
                isArchive: true
    
            }

        }
        if(!startDate){
            leavedata = {
                startDate: getdata.startDate,
                remainingLeave,
                reason,
                status,
                isArchive: true
    
            }
            //console.log(leavedata)

        }
        if(!endDate){
            leavedata = {
                endDate: getdata.endDate,
                remainingLeave,
                reason,
                status,
                isArchive: true
    
            }

        }
       

        // const leavedata = {
        //     startDate: new Date(startDate),
        //     endDate: new Date(endDate),
        //     reason,
        //     status,
        //     isArchive: true

        // }
         console.log(leavedata)
       
        // const getleave = await Leave.update(leavedata, { where: { id: id } })
        // console.log(getleave)
        // successResponse(req, res, getleave, 200);
    }
    catch (e) {
        errorResponse(req, res, e.message, 400, e);
    }
}