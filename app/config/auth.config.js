require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

module.exports = {
  // Generated here : https://www.grc.com/passwords.htm
  SECRET: process.env.JWT_SECRET,
};
