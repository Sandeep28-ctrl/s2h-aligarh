 const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
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

// 3. Final Gmail Fix (The Guaranteed Method) - रेंडर के लिए सबसे बेस्ट
const transporter = nodemailer.createTransport({
  service: 'gmail', // सीधे सर्विस का नाम, कोई पोर्ट या होस्ट की जरूरत नहीं
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// वेरिफिकेशन चेक: सर्वर स्टार्ट होते ही बताएगा कि ईमेल तैयार है या नहीं
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Gmail Connection Failed:", error);
  } else {
    console.log("✅ Gmail is Connected & Ready!");
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

        // 2. ईमेल नोटिफिकेशन भेजें
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // आपको अपने ही ईमेल पर खबर मिलेगी
            subject: 'New Booking Alert! 🚀 - S2H Smart Services',
            text: `बधाई संदीप भाई! \n\nआपकी वेबसाइट "Smart Services to Home" पर एक नई बुकिंग आई है। \n\nग्राहक का नाम: ${name} \nसर्विस की ज़रूरत: ${service} \n\nजल्द से जल्द संपर्क करें!`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("❌ Email Sending Error:", error);
            } else {
                console.log("✅ Email Sent Successfully: " + info.response);
            }
        });

        console.log("नई बुकिंग मिली और सेव हुई:", req.body);
        res.status(200).json({ success: true, message: "Booking Saved & Notification Sent!" });
        
    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ success: false, message: "Server Error: समस्या आई है" });
    }
});

// (B) सभी बुकिंग्स देखने के लिए API (Admin Panel के लिए)
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
    console.log(`🚀 Server is running on Port: ${PORT}`);
});