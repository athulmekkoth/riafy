import express from "express";
import { bookAppointment, getAvailableSlots } from "../components/UserController/BookingController.js";

const bookingRoute= express.Router()


bookingRoute.get("/getSlot",getAvailableSlots)
bookingRoute.post("/bookSlot",bookAppointment)

export default bookingRoute