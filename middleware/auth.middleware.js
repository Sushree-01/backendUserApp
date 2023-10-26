const jwt = require("jsonwebtoken");
const { blacklist } = require("../blacklist");

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    if (blacklist.includes(token)) {
      res.json({ msg: "Please login again" });
    }
    try {
      const decoded = jwt.verify(token, "payal");
      if (decoded) {
        next();
      } else {
        res.json({ msg: "token not exist" });
      }
    } catch (err) {
      res.json({ error: err.message });
    }
  } else {
    res.json({ msg: "Please login!" });
  }
};

module.exports = { auth };