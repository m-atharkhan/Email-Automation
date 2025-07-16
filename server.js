const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.post('/send', async (req, res) => {
  const { to, subject, message } = req.body;


  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
  from: process.env.EMAIL_USER,
  to,
  subject,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #4CAF50;">You've got a new message!</h2>
      <p><strong>To:</strong> ${to}</p>
      <hr>
      <p style="white-space: pre-line; line-height: 1.6;">${message}</p>
      <br>
      <footer style="font-size: 0.9em; color: #999;">
        <p>Sent via <strong>Smart Emailer</strong> | SA Tech Solutions</p>
      </footer>
    </div>
  `
};

  try {
    await transporter.sendMail(mailOptions);
    res.send(`<h3>Email sent successfully to ${to}!</h3><a href="/">Back</a>`);
  } catch (error) {
    console.error(error);
    res.send(`<h3>Failed to send email: ${error.message}</h3><a href="/">Back</a>`);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
