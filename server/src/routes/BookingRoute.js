import express from "express";
import { bookAppointment, getAvailableSlots } from "../components/UserController/BookingController.js";

const bookingRoute= express.Router()


bookingRoute.post("/getSlot",getAvailableSlots)
bookingRoute.post("/book",bookAppointment)

export default bookingRoute