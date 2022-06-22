var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const crypto = require('crypto');

const config = require('../config/auth.config');
const db = require('../models/db.model');
const {
  unexpectedErrorCatch,
  uniqueAttributeErrorCatch,
  objectNotFoundRes,
} = require('../helpers/errorCatch.helper');
const mailController = require('../controllers/mail.controller');

const User = db.user;
const Op = db.Sequelize.Op;

const signUp = (req, res) => {
  // Hash the password
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    const password = hash;

    // Generate the confirmation token
    crypto.randomBytes(16, (err, buf) => {
      const emailToken = buf.toString('hex');

      // Create the user
      User.create({
        email: req.body.email,
        password: password,
        emailToken: emailToken,
        emailTokenGeneratedAt: Date.now(),
      })
        .then((user) => {
          mailController
            .sendAccountConfirmation({
              email: user.email,
              name: user.firstName,
              emailToken: user.emailToken,
            })
            .then(() => {
              res.status(201).json({
                message:
                  'User registered successfully! Please check your email',
              });
            });
        })
        .catch(uniqueAttributeErrorCatch(res, unexpectedErrorCatch));
    });
  });
};

const signIn = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) return objectNotFoundRes(res);
      return bcrypt.compare(req.body.password, user.password, (err, same) => {
        if (same) {
          if (user.status !== 'active')
            return res.status(202).json({ message: 'Mail not confirmed yet' });

          return res.status(200).json({
            accessToken: jwt.sign({ uuid: user.uuid }, config.SECRET),
          });
        }
        return res.status(403).json({
          message: 'Wrong email/password combination',
        });
      });
    })
    .catch(unexpectedErrorCatch(res));
};

const sendEmailToken =
  (emailType = 'confirmation') =>
  (req, res) => {
    const user = req.user;
    if (Date.now() - user.emailTokenGeneratedAt < 3 * 60 * 1000)
      return res.status(409).json({
        message: 'Wait before sending a new email',
      });
    crypto.randomBytes(16, (err, buf) => {
      user.emailToken = buf.toString('hex');
      user.emailTokenGeneratedAt = Date.now();
      return user.save().then(() => {
        const options = {
          email: user.email,
          emailToken: user.emailToken,
        };

        (emailType === 'confirmation'
          ? mailController.sendAccountConfirmation(options)
          : mailController.sendResetPassword(options)
        ).then(() => {
          return res.status(202).json({ message: emailType + ' email sent!' });
        });
      });
    });
  };

// Confirm the email
const confirmEmail = (req, res) => {
  const user = req.user;
  user.status = 'active';
  user
    .save()
    .then(() => {
      res.status(200).json({
        accessToken: jwt.sign({ uuid: user.uuid }, config.SECRET),
      });
    })
    .catch(unexpectedErrorCatch(res));
};

// Sign in the user if he forgot the password in order to change it -> send the access token
const recover = (req, res) => {
  const user = req.user;
  res.status(200).json({
    accessToken: jwt.sign({ uuid: user.uuid }, config.SECRET),
  });
};

module.exports = {
  signUp,
  resendConfirmation: sendEmailToken('confirmation'),
  signIn,
  resetPassword: sendEmailToken('reset'),
  confirmEmail,
  recover,
};
