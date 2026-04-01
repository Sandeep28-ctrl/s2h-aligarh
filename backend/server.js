const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 1. MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/s2kh_bookings';
mongoose.connect(mongoURI)
    .then(() => console.log('✅ MongoDB Connected...'))
    .catch(err => console.log('❌ DB Connection Error:', err));

// 2. Booking Schema (डेटा का ढांचा)
const bookingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    service: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

// 3. API Routes

// (A) बुकिंग सेव करने के लिए API
app.post('/book', async (req, res) => {
    try {
        const { name, service } = req.body;

        if (!name || !service) {
            return res.status(400).json({ success: false, message: "कृपया सभी जानकारी भरें" });
        }

        const newBooking = new Booking({ name, service });
        await newBooking.save();

        console.log("नई बुकिंग मिली:", req.body);
        res.status(200).json({ success: true, message: "Booking Saved Successfully!" });
    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ success: false, message: "Server Error: डेटाबेस में समस्या है" });
    }
});

// (B) सभी बुकिंग्स देखने के लिए API (Admin Panel के लिए)
app.get('/admin/bookings', async (req, res) => {
    try {
        const allBookings = await Booking.find().sort({ date: -1 }); // नई बुकिंग सबसे ऊपर दिखाएगा
        res.status(200).json({ success: true, data: allBookings });
    } catch (error) {
        console.error("Admin Fetch Error:", error);
        res.status(500).json({ success: false, message: "डेटा नहीं मिल रहा" });
    }
});

// 4. Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on: http://localhost:${PORT}`);
    console.log(`🔗 Admin API: http://localhost:${PORT}/admin/bookings`);
});
// 5. किसी खास बुकिंग को डिलीट करने के लिए API
app.delete('/admin/bookings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Booking.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Booking deleted successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Delete करने में एरर आया" });
    }
});