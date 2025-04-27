let login_status = false;

const checkLogin = (req, res, next) => {
  const token = req.cookies.userId;

  if (token) {
    req.userId = token;
    req.login_status = true;
    return next();
  } else {
    next();
  }
};

module.exports = checkLogin;
