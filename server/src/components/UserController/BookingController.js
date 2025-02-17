import { Appointment } from "../../schema/BookingSchema.js";
import express from "express"

export const getAvailableSlots = async (req, res) => {
  const selectedDate = new Date(req.params.date);
  const slots = [
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
    '4:00 PM', '4:30 PM'
  ];

  try {
    const bookedSlots = await Appointment.find({ date: selectedDate }).select('timeSlot');

    const availableSlots = slots.filter(slot => 
      !bookedSlots.some(booking => booking.timeSlot === slot)
    );

    const availableSlotsFiltered = availableSlots.filter(slot => 
      slot !== '1:00 PM' && slot !== '1:30 PM'
    );

    res.json({ availableSlots: availableSlotsFiltered });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};




export const bookAppointment = async (req, res) => {
  const { name, phone, date, timeSlot } = req.body;
  try {
    const existingBooking = await Appointment.findOne({ date: new Date(date), timeSlot });
    if (existingBooking) {
      return res.status(400).json({ success: false, message: 'This slot is already booked. Please choose a different time.' });
    }
    const newAppointment = new Appointment({
      name,
      phone,
      date: new Date(date),
      timeSlot
    });
    await newAppointment.save();
    return res.json({ success: true, message: 'Your appointment has been booked!' });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};


