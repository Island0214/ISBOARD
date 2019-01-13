var Blackboard = require('../models/blackboard');
var mongoose = require('mongoose');

module.exports.createNewBlackboard = function (req, res) {
    let user = req.body.user;
    if (user === undefined || user === '') {
        return res.send({status: 0, msg: 'Please log in before creating blackboard.'});
    }
    let time = new Date().getTime();
    let blackboard = new Blackboard({
        user: user,
        strokes: [],
        thumbnail: '',
        lastUpdated: time,
        createdAt: time,
    });
    blackboard.save(function (err, content) {
        if (err) {
            return res.send({status: 0, msg: err || 'Fail'});
        } else {
            let newBlackboard = {
                id: content._id,
                createdAt: content.createdAt,
            };
            return res.send({status: 1, msg: "Succeed", data: newBlackboard});
        }
    })
};

module.exports.findBlackboardByUser = function (req, res) {
    let user = req.body.user;
    if (user === undefined || user === '') {
        return res.send({status: 0, msg: 'Please log in before creating blackboard.'});
    }
    Blackboard.find({user: user}).sort({ createdAt: -1 }).exec(function (err, content) {
        if (err) {
            return res.send({status: 0, msg: err || 'Fail'});
        } else {
            let blackboards = content.map(
                (blackboard) => {
                    return {
                        id: blackboard._id,
                        thumbnail: blackboard.thumbnail,
                        strokes: blackboard.strokes,
                        createdAt: blackboard.createdAt,
                    }
                }
            );
            return res.send({status: 1, msg: "Succeed", data: blackboards});
        }
    })
};

module.exports.removeBlackboard = function (req, res) {
    let id = req.body.id;
    let user = req.body.user;
    Blackboard.findById(id, function (err, content) {
        if (err) {
            return res.send({status: 0, msg: err || 'Unknown Blackboard'});
        } else {
            if (user === content.user.toString()) {
                Blackboard.deleteOne({_id: id}, function (err) {
                    if (err) {
                        return res.send({status: 0, msg: err || 'Fail'});
                    } else {
                        return res.send({status: 1, msg: "Succeed"});
                    }
                })
            } else {
                return res.send({status: 0, msg: 'Invalid User'});
            }
        }
    })
};