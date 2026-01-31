const mongoose = require("mongoose")

const slotSchema = new mongoose.Schema({
    interviewDate: {
        type: Date,
        required: true
    },
    interviewTime: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    isBooked: {
        type: Boolean,
        default: false
    },
    bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
})

const Slot = mongoose.model("Slot", slotSchema)
module.exports = Slot