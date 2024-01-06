const mongoose = require('mongoose');
const {Schema,model} = mongoose;

const SessionReportSchema = new Schema({
    date:Date,
    summary:String,
    content:String,
    client:{type:Schema.Types.ObjectId, ref:'Client'},
    author:{type:Schema.Types.ObjectId, ref:'User'},

}, {
    timestamps: true,
});

const SessionReportModel = model('SessionReport', SessionReportSchema);

module.exports = SessionReportModel;