const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const ClientSchema = new Schema({
  card_id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, min: 4 },
  birth_date: { type: Date, required: true },
  address: { type: String },
  parent_name: { type: String },
  contact_number: { type: Number },
  doctor: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true,
});

const ClientModel = model('Client', ClientSchema);

module.exports = ClientModel;