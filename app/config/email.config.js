require('dotenv').config();

module.exports = {
  WEBSITE_NAME: 'Okalo',
  CONFIRMATION_ROUTE: process.env.WEBSITE_URL + '/confirm-email/email-token/',
  CONTACT_EMAIL: 'contact@example.com',
  HOST: process.env.MAIL_HOST,
  USER: process.env.MAIL_USER,
  PORT: process.env.MAIL_PORT,
  PASSWORD: process.env.MAIL_PASSWORD,
  ACTIVATED:
    process.env.MAIL_HOST &&
    process.env.MAIL_USER &&
    process.env.MAIL_PASSWORD &&
    true,
};
