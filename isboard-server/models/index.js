var mongoose = require('mongoose');
var testDB = "mongodb://localhost:27017/isboard";
mongoose.connect(testDB, function (err) {
    if (err) {
        console.log('connect fail');
    } else {
        console.log('connect success');
    }
});
module.exports = mongoose;