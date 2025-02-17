import { Appointment } from "../../schema/BookingSchema.js";
import express from "express"
export const getAvailableSlots = async (req, res) => {
  const { date } = req.query; 

  if (!date) {
    return res.status(400).json({ error: "Date parameter is required." });
  }

  const selectedDate = new Date(date);
  const slots = [
    "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
    "4:00 PM", "4:30 PM"
  ];

  try {
    const bookedSlots = await Appointment.find({ date: selectedDate }).select("timeSlot");

    const availableSlots = slots.filter(slot =>
      !bookedSlots.some(booking => booking.timeSlot === slot)
    );

    const availableSlotsFiltered = availableSlots.filter(slot =>
      slot !== "1:00 PM" && slot !== "1:30 PM"
    );

    res.json({ availableSlots: availableSlotsFiltered.length ? availableSlotsFiltered : [] });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};




export const bookAppointment = async (req, res) => {
  const { name, phone, date, timeSlot } = req.body;

  const availableSlotsList = [
    "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "2:00 PM", "2:30 PM",
    "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"
  ];


  if (!name || !phone || !date || !timeSlot) {
    return res.status(400).json({ 
      success: false, 
      message: "All fields (name, phone, date, timeSlot) are required." 
    });
  }

  const selectedDate = new Date(date);
  if (isNaN(selectedDate.getTime())) {
    return res.status(400).json({ success: false, message: "Invalid date format. Use YYYY-MM-DD." });
  }

  if (!availableSlotsList.includes(timeSlot)) {
    return res.status(400).json({
      success: false,
      message: "Invalid time slot. Please select from the available slots."
    });
  }

  try {
    const existingBooking = await Appointment.findOne({ date: selectedDate, timeSlot });

    if (existingBooking) {
      return res.status(400).json({ 
        success: false, 
        message: "This slot is already booked. Please choose a different time." 
      });
    }

    const newAppointment = new Appointment({
      name,
      phone,
      date: selectedDate,
      timeSlot
    });

    await newAppointment.save();
    return res.json({ success: true, message: "Your appointment has been booked!" });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
