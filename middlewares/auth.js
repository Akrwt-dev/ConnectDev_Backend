const checkAdmin = (req, res, next) => {
  const token = "xyz";
  const password = token === "xyz";
  if (!password) {
    res.send("User is unautherise");
  } else {
    next();
  }
};

const checkUser = (req, res, next) => {
  const token = "xyz";
  const password = token === "xyz";
  if (!password) {
    res.send("User is unautherise");
  } else {
    next();
  }
};

module.exports = { checkAdmin, checkUser };
