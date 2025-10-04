const jwt = require("jsonwebtoken");
const User = require("../src/modules/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("No token found");
    }

    const decodedData = jwt.verify(token, "DEV@Tinder790");


    const user = await User.findById(decodedData._id);
    if (!user) {
      return res.status(404).send("User Not Found!");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).send("Authentication failed: " + err.message);
  }
};

module.exports = { userAuth };
