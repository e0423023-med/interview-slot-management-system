const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth")
const Slot = require("../models/slotModel")
const User = require("../models/userModel")

router.post('/slots/create', auth, async (req, res) => {
    const interviewDate = req.body.interviewDate;
    const interviewTime = req.body.interviewTime

    if (!interviewDate || !interviewTime) {
        return res.json({ "message": "Please send date and time" })
    }

    const slot = new Slot({
        interviewDate: interviewDate,
        interviewTime: interviewTime,
        status: "AVAILABLE",
        createdBy: req.user,
        isBooked: false
    });

    await slot.save()
    return res.json({ "message": "slot created" })
})

router.get('/slots/my-slots', auth, async (req, res) => {
    const slots = await Slot.find({ createdBy: req.user })
        .sort({ createdAt: -1 })
    res.json({ "slots": slots })
})

router.get('/slots/available', auth, async (req, res) => {
    const user = await User.findById(req.user)
    if (user.role !== "candidate") {
        return res.json({ "message": "Only candidates can view available slots" })
    }

    const slots = await Slot.find({ isBooked: false })
        .populate('createdBy', 'name email')
        .sort({ interviewDate: 1, interviewTime: 1 })
    res.json({ "slots": slots })
})

router.put('/slots/:id/book', auth, async (req, res) => {
    const slotId = req.params.id

    const slot = await Slot.findById(slotId)
    if (!slot) {
        return res.json({ "message": "Slot not found" })
    }

    if (slot.isBooked) {
        return res.json({ "message": "Slot already booked" })
    }

    const user = await User.findById(req.user)
    if (user.role !== "candidate") {
        return res.json({ "message": "Only candidates can book slots" })
    }

    slot.status = "BOOKED"
    slot.isBooked = true
    slot.bookedBy = req.user
    slot.bookedAt = new Date()

    await slot.save()
    res.json({ "message": "Slot booked successfully" })
})

router.put('/slots/:id/cancel', auth, async (req, res) => {
    const slotId = req.params.id

    const slot = await Slot.findById(slotId)
    if (!slot) {
        return res.json({ "message": "Slot not found" })
    }

    if (slot.bookedBy.toString() !== req.user.toString()) {
        return res.json({ "message": "Not authorized to cancel this booking" })
    }

    slot.status = "AVAILABLE"
    slot.isBooked = false
    slot.bookedBy = null
    slot.bookedAt = null

    await slot.save()
    res.json({ "message": "Booking cancelled successfully" })
})

module.exports = router