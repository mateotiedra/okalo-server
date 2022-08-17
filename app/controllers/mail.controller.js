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
          from: 'no-reply@okalo.ch',
          to: email,
          subject: 'Lien de confirmation',
          html: `<h2>Vérification de l'adresse email</h2>
            <p>Bonjour${name ? ' ' + name : ''},<br/>
            Afin de finaliser la création de ton compte, merci de confirmer ton adresse email en cliquant sur le lien suivant : <a href=${
              config.CONFIRMATION_ROUTE
            }/${emailToken}>créer mon compte</a>
            <br/>Si ne n'est pas toi qui a créé de compte sur ${
              config.WEBSITE_NAME
            }, merci d'ignorer cet email.<br/>
            Contact : <a href="mailto:${config.CONTACT_EMAIL}">${
            config.CONTACT_EMAIL
          }</a></p>`,
        })
        .then(resolve)
        .catch(reject);
    else {
      console.log(
        `\n${email}'s confirmation link : ${config.CONFIRMATION_ROUTE}/${emailToken}\n`
      );
      resolve();
    }
  });

const sendResetPassword = ({ email, name = '', emailToken }) =>
  new Promise((resolve, reject) => {
    if (config.ACTIVATED)
      transport
        .sendMail({
          from: 'no-reply@okalo.ch',
          to: email,
          subject: 'Mot de passe oublié',
          html: `<h2>Nouveau mot de passe</h2>
          <p>Bonjour${name ? ' ' + name : ''},<br/>
            Tu peux te connecter afin de changer ton mot de passe en cliquant sur le lien suivant : <a href=${
              config.RESET_PASSWORD_ROUTE
            }/${emailToken}>changer mon mot de passe</a>
            <br/>Si ne n'est pas toi qui a demandé à réinitialiser ton mot de passe, merci d'ignorer cet email.
            <br/>Contact : <a href="mailto:${config.CONTACT_EMAIL}">${
            config.CONTACT_EMAIL
          }</a></p>`,
        })
        .then(resolve)
        .catch(reject);
    else {
      console.log(
        `\n${email}'s confirmation link : ${config.RESET_PW_ROUTE}/${emailToken}\n`
      );
      resolve();
    }
  });

module.exports = {
  sendAccountConfirmation,
  sendResetPassword,
};
