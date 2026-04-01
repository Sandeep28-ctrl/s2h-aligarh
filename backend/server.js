 const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer'); // Nodemailer जोड़ा गया
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

// 2. Booking Schema
const bookingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    service: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

// 3. Email Config (Transporter)
// यहाँ अपनी जानकारी भरें
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // अपना Gmail यहाँ लिखें
    pass: 'your-app-password'    // अपना 16-अक्षरों वाला App Password यहाँ लिखें
  }
});

// 4. API Routes

// (A) बुकिंग सेव करने और ईमेल भेजने के लिए API
app.post('/book', async (req, res) => {
    try {
        const { name, service } = req.body;

        if (!name || !service) {
            return res.status(400).json({ success: false, message: "कृपया सभी जानकारी भरें" });
        }

        // 1. डेटाबेस में सेव करें
        const newBooking = new Booking({ name, service });
        await newBooking.save();

        // 2. ईमेल भेजें
        const mailOptions = {
            from: 'your-email@gmail.com', // आपका ईमेल
            to: 'your-email@gmail.com',   // आपको ईमेल कहाँ चाहिए (अपना ही ईमेल डाल दें)
            subject: 'New Booking Alert! 🚀 - S2H Smart Services',
            text: `बधाई संदीप भाई! \n\nआपकी वेबसाइट "Smart Services to Home" पर एक नई बुकिंग आई है। \n\nग्राहक का नाम: ${name} \nसर्विस की ज़रूरत: ${service} \n\nजल्द से जल्द संपर्क करें!`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Email Error:", error);
            } else {
                console.log("Email Sent: " + info.response);
            }
        });

        console.log("नई बुकिंग मिली और डेटाबेस में सेव हुई:", req.body);
        res.status(200).json({ success: true, message: "Booking Saved & Notification Sent!" });
        
    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ success: false, message: "Server Error: डेटाबेस या ईमेल में समस्या है" });
    }
});

// (B) सभी बुकिंग्स देखने के लिए API
app.get('/admin/bookings', async (req, res) => {
    try {
        const allBookings = await Booking.find().sort({ date: -1 });
        res.status(200).json({ success: true, data: allBookings });
    } catch (error) {
        console.error("Admin Fetch Error:", error);
        res.status(500).json({ success: false, message: "डेटा नहीं मिल रहा" });
    }
});

// (C) किसी खास बुकिंग को डिलीट करने के लिए API
app.delete('/admin/bookings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Booking.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Booking deleted successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Delete करने में एरर आया" });
    }
});

// 5. Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on: http://localhost:${PORT}`);
});