var express = require('express');
var router = express.Router();
var User = require("../api/user");

router.post('/register', User.userReg);
router.post('/login', User.userLogin);
router.post('/find/one', User.findUserByID);

module.exports = router;
