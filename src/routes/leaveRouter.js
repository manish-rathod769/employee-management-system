const express = require("express");
const router = new express.Router();
const leaveRegister = require('../controllers/leave/leaveController');

router.post('/register/leave',leaveRegister);

module.exports = router;