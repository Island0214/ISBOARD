var User = require('../models/user');

module.exports.userReg = function (req, res, next) {
    var userName = req.body.name;
    var userPwd = req.body.password;
    if (userName === '' || userPwd === '') {
        return res.send({status: 0, msg: "Username or password cannot be empty"});
    }
    var regUser = new User({
        password: userPwd,
        name: userName,
    });
    regUser.save(function (err, content) {
        if (err) {
            return res.send({status: 0, msg: err || 'Fail'});
        } else {
            return res.send({status: 1, msg: "Succeed"});
        }
    })
};

module.exports.userLogin = function (req, res, next) {
    var userName = req.body.name;
    var userPwd = req.body.password;
    if (userName === '' || userPwd === '') {
        return res.send({status: 0, msg: "Username or password cannot be empty"});
    }
    User.findOne({name: userName}, function (err, content) {
        if (err) {
            return res.send({status: 0, msg: err || 'Fail'});
        } else {
            var pwd = content.password;
            if (pwd === userPwd) {
                var userData = {
                    "id": content._id,
                    "name": content.name
                };
                return res.send({status: 1, msg: "Succeed", data: userData});
            } else  {
                return res.send({status: 1, msg: "Fail"});
            }
        }
    });
};