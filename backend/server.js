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

// 3. Updated Email Config with Timeouts (Render Fix)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, 
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  connectionTimeout: 10000, // 10 सेकंड का समय
  greetingTimeout: 10000,
  socketTimeout: 10000,
  tls: {
    rejectUnauthorized: false
  }
});

// वेरिफिकेशन चेक
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Email Connection Failed:", error);
  } else {
    console.log("✅ Server is ready to send emails");
  }
});

// 4. API Routes

app.post('/book', async (req, res) => {
    try {
        const { name, service } = req.body;

        if (!name || !service) {
            return res.status(400).json({ success: false, message: "कृपया सभी जानकारी भरें" });
        }

        const newBooking = new Booking({ name, service });
        await newBooking.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, 
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

        console.log("नई बुकिंग मिली:", req.body);
        res.status(200).json({ success: true, message: "Booking Saved & Notification Sent!" });
        
    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

app.get('/admin/bookings', async (req, res) => {
    try {
        const allBookings = await Booking.find().sort({ date: -1 });
        res.status(200).json({ success: true, data: allBookings });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

app.delete('/admin/bookings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Booking.findByIdAndDelete(id);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on Port: ${PORT}`);
});