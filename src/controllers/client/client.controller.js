import { v4 as uuidv4 } from 'uuid';
import { successResponse, errorResponse } from '../../helpers/index';
import { Client } from '../../models';
import { Op } from 'sequelize';
// const { Client } = require('../../models');

export const clientRegisterController = async(req, res) => {
  try{
    const { name, email, slackId, city, state, country, organization } = req.body;
    // const 
    const clientDetails = {
      id: uuidv4(),
      name,
      email,
      slackId,
      city,
      state,
      country,
      organization,
      isArchive: false,
    }
    const isUserExist = await Client.findAll({ where: { [Op.or]: [ {email}, {slackId}]} });
    if(isUserExist.length) throw new Error('EmailID or slackID alreay exists in the database !!!');
    
    const newClient = await Client.create(clientDetails);
    successResponse(req, res, newClient, 200);
  }catch(error){
    errorResponse(req, res, error.message, 500, error);
  }

}