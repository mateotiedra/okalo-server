require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

module.exports = {
  WEBSITE_NAME: 'Okalo',
  CONFIRMATION_ROUTE: process.env.WEBSITE_URL + '/confirm-email/email-token',
  RESET_PASSWORD_ROUTE:
    process.env.WEBSITE_URL + '/user/u/edit/change-password',
  CONTACT_EMAIL: 'contact@okalo.com',
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
