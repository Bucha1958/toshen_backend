import mongoose from 'mongoose';

const EquipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String },
  no: { type: Number, required: true },
});


export const Equipment = mongoose.model('Equipment', EquipmentSchema);