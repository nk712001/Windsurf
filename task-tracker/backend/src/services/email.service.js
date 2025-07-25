const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');

const createTransporter = async () => {
  let testAccount = await nodemailer.createTestAccount();

  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

const sendVerificationEmail = async (user, verificationUrl) => {
  const transporter = await createTransporter();
  const templatePath = path.join(__dirname, '..', 'templates', 'emailVerification.html');
  let htmlTemplate = await fs.readFile(templatePath, 'utf-8');

  htmlTemplate = htmlTemplate.replace('{{name}}', user.name).replace('{{verificationLink}}', verificationUrl);

  const mailOptions = {
    from: '"Daily Task Tracker" <noreply@tasktracker.com>',
    to: user.email,
    subject: 'Verify Your Email Address',
    html: htmlTemplate,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Verification email sent. Preview URL: %s', nodemailer.getTestMessageUrl(info));
};

const sendPasswordResetEmail = async (user, resetUrl) => {
  const transporter = await createTransporter();
  const templatePath = path.join(__dirname, '..', 'templates', 'passwordReset.html');
  let htmlTemplate = await fs.readFile(templatePath, 'utf-8');

  htmlTemplate = htmlTemplate.replace('{{name}}', user.name).replace('{{resetLink}}', resetUrl);

  const mailOptions = {
    from: '"Daily Task Tracker" <noreply@tasktracker.com>',
    to: user.email,
    subject: 'Password Reset Request',
    html: htmlTemplate,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Password reset email sent. Preview URL: %s', nodemailer.getTestMessageUrl(info));
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
