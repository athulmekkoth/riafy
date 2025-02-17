import mongoose from "mongoose";
const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
});

export const Appointment = mongoose.model('Appointment', appointmentSchema);

