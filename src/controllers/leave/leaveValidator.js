import joi from 'joi';
import { errorResponse } from '../../helpers/index';

const leaveRegisterValid = joi.object({
    startDate: joi.date().required(),
    endDate: joi.date().required(),
    reason: joi.string().trim(true).required(),
    //status: joi.string().trim(true).valid('pending','approved','rejected').required(),
    //remainingLeave: joi.string().trim(true).required(),
});

export const leaveRegisterValidation = async (req, res, next) => {
    const payload = {
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        reason: req.body.reason,
        // status: req.body.status,
        // remainingLeave: req.body.remainingLeave,
    }

    const { error } = leaveRegisterValid.validate(payload);
    if (error) {
        errorResponse(req, res, error.message, 206, error.details);
    } else {
        next();
    }
}