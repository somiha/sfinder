let login_status = false;

const checkLogin = (req, res, next) => {
  const is_logged_in = req.cookies.is_logged_in;

  if (!is_logged_in) {
    return res.redirect("/admin/login");
  }
  try {
    req.is_logged_in = true;

    return next();
  } catch (err) {
    return res.status(500).redirect("/admin/login");
  }
  // const token = req.cookies.userId;

  // if (token) {
  //   req.userId = token;
  //   req.login_status = true;
  //   return next();
  // } else {
  //   next();
  // }
};

module.exports = checkLogin;
