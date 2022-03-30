import express from 'express';

import * as userController from '../controllers/user/user.controller';

const router = express.Router();

//= ===============================
// Public routes
//= ===============================

router.post(
  '/register',
  userController.register,
);

module.exports = router;
