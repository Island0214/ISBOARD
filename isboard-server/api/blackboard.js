var Blackboard = require('../models/blackboard');

module.exports.createNewBlackboard = function (req, res, next) {
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

module.exports.findBlackboardByUser = function (req, res, next) {
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
            console.log(blackboards);
            return res.send({status: 1, msg: "Succeed", data: blackboards});
        }
    })
};
