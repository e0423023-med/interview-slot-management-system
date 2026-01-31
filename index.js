require("dotenv").config()
const express = require("express")
const connectDB = require("./config/db")
const userApi = require("./api/userApi")
const slotApi = require("./api/slotApi")
const candidateApi = require("./api/candidateApi")

const app = express()

app.use(express.json())

connectDB()

app.use("/api/auth", userApi)
app.use("/api/recruiter", slotApi)
app.use("/api/candidate", candidateApi)

app.get("/", (req, res) => {
    res.json({ message: "Interview Slot Management System" })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("Server running on port" ,PORT)
})