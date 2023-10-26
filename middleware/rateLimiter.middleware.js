const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 25,
});

module.exports = { limiter };