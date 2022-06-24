const config = require('../config/email.config');
const nodemailer = require('nodemailer');

const user = config.USER;

const transport = nodemailer.createTransport({
  host: config.HOST,
  secure: false,
  port: config.PORT,
  direct: true,
  auth: {
    user: user,
    pass: config.PASSWORD,
  },
});

// Auth

const sendAccountConfirmation = ({ email, name = '', emailToken }) =>
  new Promise((resolve, reject) => {
    if (config.ACTIVATED)
      transport
        .sendMail({
          from: user,
          to: email,
          subject: 'Lien de confirmation',
          html: `<h1>Vérification de l'adresse email</h1>
      <h2>Bonjour${name ? ' ' + name : ''},</h2>
      <p>Afin de finaliser la création de votre compte, merci de confirmer votre adresse email en cliquant sur le lien suivant : <a href=${
        config.CONFIRMATION_ROUTE
      }/${emailToken}>créer mon compte</a>
      <br/>Si ne n'est pas vous qui a créé de compte sur ${
        config.WEBSITE_NAME
      }, merci d'ignorer cet email.
      <br/>Contact : <a href="mailto:${config.CONTACT_EMAIL}">${
            config.CONTACT_EMAIL
          }</a></p>`,
        })
        .then(resolve)
        .catch(reject);
    else {
      console.log(`\n${email}'s emailToken : ${emailToken}\n`);
      resolve();
    }
  });

const sendResetPassword = ({ email, name = '', emailToken }) =>
  new Promise((resolve, reject) => {
    console.log(`\n${email}'s reset password emailToken : ${emailToken}\n`);
    transport
      .sendMail({
        from: user,
        to: email,
        subject: 'Mot de passe oublié',
        html: `<h1>Nouveau mot de passe</h1>
            <h2>Bonjour${name ? ' ' + name : ''},</h2>
            <p>Vous pouvez vous connecter afin de changer votre mot de passe en cliquant sur le lien suivant : <a href=${
              config.RESET_PASSWORD_ROUTE
            }/${emailToken}>change mon mot de passe</a>
            <br/>Si ne n'est pas vous qui avez demandé à réinitialiser votre mot de passe, merci d'ignorer cet email.
            <br/>Contact : <a href="mailto:${config.CONTACT_EMAIL}">${
          config.CONTACT_EMAIL
        }</a></p>`,
      })
      .then(resolve)
      .catch(reject);
  });

module.exports = {
  sendAccountConfirmation,
  sendResetPassword,
};
