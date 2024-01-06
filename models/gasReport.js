const mongoose = require('mongoose');
const {Schema,model} = mongoose;

const GasSchema = new Schema({
  car_plate:String,
  car_km:Number,
  quantity:Number,
  price:Number,
  author:{type:Schema.Types.ObjectId, ref:'User'},
}, {
  timestamps: true,
});

const GasModel = model('Gas', GasSchema);

module.exports = GasModel;