const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyUser = async (req, res, next) => {
  try {
    const token = req.headers.token?.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
      if (err) {
        return res.status(404).json({
          status: "ERR",
          message: err.message,
        });
      }
      req.user = user
      next();
    });
  } catch (error) {
    return res.status(404).json({
      status: "ERR",
      message: error.message,
    });
  }
};

module.exports = verifyUser;
