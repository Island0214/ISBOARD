var User = require('../models/user');

module.exports.userReg = function (req, res, next) {
    let userName = req.body.username;
    let userPwd = req.body.password;
    if (userName === '' || userPwd === '') {
        return res.send({status: 0, msg: "Username or password cannot be empty"});
    }
    let regUser = new User({
        password: userPwd,
        name: userName,
    });

    User.findOne({name: userName}, function (err, content) {
        if (err) {
            return res.send({status: 0, msg: err || 'Fail'});
        } else {
            if (content === null) {
                regUser.save(function (err, content) {
                    if (err) {
                        return res.send({status: 0, msg: err || 'Fail'});
                    } else {
                        User.findOne({name: userName}, function (err, content) {
                            if (err) {
                                return res.send({status: 0, msg: err || 'Error occurred. Please try again.'});
                            } else {
                                if (content === null) {
                                    return res.send({status: 0, msg: "Cannot find user."});
                                }
                                let userData = {
                                    "id": content._id,
                                    "name": content.name
                                };
                                return res.send({status: 1, msg: "Succeed", data: userData});
                            }
                        });
                    }
                })
            } else {
                return res.send({status: 0, msg: "Username has been registered."});
            }
        }
    });
};

module.exports.userLogin = function (req, res) {
    let userName = req.body.username;
    let userPwd = req.body.password;
    if (userName === '' || userPwd === '') {
        return res.send({status: 0, msg: "Username or password cannot be empty."});
    }
    User.findOne({name: userName}, function (err, content) {
        if (err) {
            return res.send({status: 0, msg: err || 'Error occurred. Please try again.'});
        } else {
            if (content === null) {
                return res.send({status: 0, msg: "Invalid username or wrong password."});
            }
            var pwd = content.password;
            if (pwd === userPwd) {
                let userData = {
                    "id": content._id,
                    "name": content.name
                };
                return res.send({status: 1, msg: "Succeed", data: userData});
            } else {
                return res.send({status: 0, msg: "Invalid username or wrong password."});
            }
        }
    });
};

module.exports.findUserByID = function (req, res) {
    let id = req.body.id;
    if (id === '') {
        return res.send({status: 0, msg: "ID cannot be empty."});
    }
    User.findOne({_id: id}, function (err, content) {
        if (err) {
            return res.send({status: 0, msg: err || 'Error occurred. Please try again.'});
        } else {
            if (content === null) {
                return res.send({status: 0, msg: "Cannot find user."});
            }
            let userData = {
                "id": content._id,
                "name": content.name
            };
            return res.send({status: 1, msg: "Succeed", data: userData});
        }
    });
};