const { createTransporter } = require('../config/email');

const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: `"DevMarket" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
