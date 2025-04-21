function checkAuth(req, res, next) {
  if (req.session && req.session.isLoggedIn) {
    return next();
  }
  res.redirect("/login");
}

module.exports = checkAuth