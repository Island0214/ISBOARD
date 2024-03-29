var mongoose = require("./index");
var Schema = mongoose.Schema;

var PointSchema = new Schema({
    x: {type: Number},
    y: {type: Number},
});

var AnimationSchema = new Schema({
    type: {type: String},
    x: {type: Number},
    y: {type: Number},
    speed: {type: Number},
    count: {type: Number},
});

var StrokeSchema = new Schema({
    type: {type: String},
    points: [PointSchema],
    solid: {type: Boolean},
    color: {type: String},
    thickness: {type: Number},
    animation: {type: AnimationSchema},
});

var BlackboardSchema = new Schema({
    user: {type: mongoose.Types.ObjectId},
    thumbnail: {type: String},
    strokes: [StrokeSchema],
    createdAt: Number,
    lastUpdated: Number,
});

module.exports = mongoose.model('Blackboard', BlackboardSchema);