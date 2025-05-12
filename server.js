const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service
    auth: {
        user: 'danjchalmers@gmail.com', // Your email
        pass: 'Atlantis2613!' // Your email password
    }
});

// Handle form submission
app.post('/send', (req, res) => {
    const mailOptions = {
        from: req.body.email,
        to: 'danjchalmers@gmail.com', // Your email to receive messages
        subject: 'New Contact Form Submission',
        text: `Name: ${req.body.name}\nEmail: ${req.body.email}\nMessage: ${req.body.message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send('Error sending email');
        }
        res.send('Email sent successfully');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 