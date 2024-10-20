// lib/testEmail.js
const nodemailer = require('nodemailer');

async function testEmail() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'recipient-email@example.com', // เปลี่ยนเป็นอีเมลที่คุณต้องการส่งไป
    subject: 'Test Email',
    text: 'This is a test email to verify email sending.',
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

testEmail();
