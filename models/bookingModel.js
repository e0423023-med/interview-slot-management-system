const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    slotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Slot"
    },
    status: {
        type: String,
        default: "confirmed"
    }
}, {
    timestamps: true
})

const Booking = mongoose.model("Booking", bookingSchema)
module.exports = Booking