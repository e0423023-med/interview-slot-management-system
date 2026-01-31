const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth")
const Slot = require("../models/slotModel")
const Booking = require("../models/bookingModel")
const User = require("../models/userModel")

router.get('/slots', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user)
        if (user.role !== "candidate") {
            return res.json({ "message": "Only candidates can view slots" })
        }

        const slots = await Slot.find({ isBooked: false })
            .populate('createdBy', 'name email')
            .sort({ interviewDate: 1, interviewTime: 1 })

        res.json({ "slots": slots })
    } catch (error) {
        console.log(error)
        return res.json({ "message": "server error" })
    }
})

router.post('/book/:slotId', auth, async (req, res) => {
    try {
        const slotId = req.params.slotId

        const user = await User.findById(req.user)
        if (user.role !== "candidate") {
            return res.json({ "message": "Only candidates can book slots" })
        }

        const slot = await Slot.findById(slotId)
        if (!slot) {
            return res.json({ "message": "Slot not found" })
        }

        if (slot.isBooked) {
            return res.json({ "message": "Slot already booked" })
        }

        const existingBooking = await Booking.findOne({ userId: req.user })
        if (existingBooking) {
            return res.json({ "message": "You already have a booking" })
        }

        const booking = new Booking({
            userId: req.user,
            slotId: slotId,
            status: "confirmed"
        })

        await booking.save()

        slot.isBooked = true
        slot.bookedBy = req.user
        slot.status = "BOOKED"
        await slot.save()

        res.json({ "message": "Slot booked successfully" })
    } catch (error) {
        console.log(error)
        return res.json({ "message": "server error" })
    }
})
router.get('/bookings', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user)
        if (user.role !== "candidate") {
            return res.json({ "message": "Only candidates can view bookings" })
        }

        const bookings = await Booking.find({ userId: req.user })
            .populate('slotId', 'interviewDate interviewTime')
            .sort({ createdAt: -1 })

        res.json({ "bookings": bookings })
    } catch (error) {
        console.log(error)
        return res.json({ "message": "server error" })
    }
})

module.exports = router