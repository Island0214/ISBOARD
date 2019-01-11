var mongoose = require("./index");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: {type: String},
    password: {type: String}
});
module.exports = mongoose.model('User', UserSchema);