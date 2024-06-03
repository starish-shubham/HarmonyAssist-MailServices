const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();
// Import cors middleware
const cors = require('cors');

const corsOptions = {
    origin: 'https://github.com/starish-shubham/HarmonyAssist-MailServices/blob/master/frontend/index.html', // Allow requests from this origin
    methods: 'GET,POST,PUT,DELETE', // Allow only specified methods
};

app.use(cors(corsOptions));

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS for all routes
app.use(cors());

app.post('/send-email', (req, res) => {

    console.log("Request received");
    async function sendMail() {
    const { senderemail, recieveremail, subject, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

    const mailOptions = {
        // from: process.env.EMAIL,
        from: senderemail,
        to: recieveremail,
        subject: subject,
        text: message,
        replyTo: senderemail,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email Sent Successfully");
    } catch (error) {
        console.log("Email Send Failed: ", error);
    }
    // transporter.sendMail(mailOptions, (error, info) => {
    //     if (error) {
    //         return res.status(500).json({ error: error.toString() });
    //     }
    //     res.status(200).json({ message: 'Email sent1: ' + info.response });
    // });
}

sendMail();
});
    

    


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
