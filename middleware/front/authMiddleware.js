const jwt = require("jsonwebtoken");
const User = require("../../models/User");

const requireAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (!err) {
        next();
      }
    });
  }
  res.redirect("/login");
};

//check current user
const checkUser = async (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (!err) {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      } else {
        res.locals.user = null;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkUser };
