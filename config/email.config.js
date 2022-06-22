require('dotenv').config();

module.exports = {
  WEBSITE_NAME: 'example',
  CONFIRMATION_ROUTE: 'www.example.com/confirm-email',
  CONTACT_EMAIL: 'contact@example.com',
  HOST: process.env.MAIL_HOST,
  USER: process.env.MAIL_USER,
  PORT: process.env.MAIL_PORT,
  PASSWORD: process.env.MAIL_PASSWORD,
};
