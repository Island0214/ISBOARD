var express = require('express');
var router = express.Router();
var Blackboard = require("../api/blackboard");

router.post('/create', Blackboard.createNewBlackboard);
router.post('/find/one', Blackboard.findBlackboardByUser);
router.post('/remove', Blackboard.removeBlackboard);

module.exports = router;
