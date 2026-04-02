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

// 3. Email Config (अभी के लिए इसे शांत रखा है)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, 
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// 4. API Routes

app.post('/book', async (req, res) => {
    try {
        const { name, service } = req.body;

        if (!name || !service) {
            return res.status(400).json({ success: false, message: "कृपया सभी जानकारी भरें" });
        }

        // बुकिंग डेटाबेस में सेव होगी
        const newBooking = new Booking({ name, service });
        await newBooking.save();

        /* ईमेल वाला हिस्सा अभी बंद है (Temporarily Disabled)
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, 
            subject: 'New Booking Alert! 🚀 - S2H Smart Services',
            text: `बधाई संदीप भाई! \n\nग्राहक: ${name} \nसर्विस: ${service}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("❌ Email Sending Error:", error);
            } else {
                console.log("✅ Email Sent Successfully");
            }
        });
        */

        console.log("✅ नई बुकिंग मिली और DB में सेव हुई:", req.body);
        res.status(200).json({ 
            success: true, 
            message: "बुकिंग मिल गई! हमारी टीम जल्द संपर्क करेगी।" 
        });
        
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