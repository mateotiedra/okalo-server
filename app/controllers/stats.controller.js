const { unexpectedErrorCatch } = require('../helpers/errorCatch.helper');

const db = require('../models/db.model');
const User = db.user;
const Book = db.book;
const Bid = db.bid;
const Institution = db.institution;

/**
 * Get home page statistics
 * Returns counts of users, books, bids, and institutions
 */
const getHomeStats = async (req, res) => {
  try {
    const [userCount, bookCount, bidCount, institutionCount] = await Promise.all([
      User.count(),
      Book.count(),
      Bid.count(),
      Institution.count(),
    ]);

    res.status(200).json({
      users: userCount,
      books: bookCount,
      bids: bidCount,
      institutions: institutionCount,
    });
  } catch (err) {
    unexpectedErrorCatch(res)(err);
  }
};

module.exports = {
  getHomeStats,
};
