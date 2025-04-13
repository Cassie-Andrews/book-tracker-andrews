const indexModel = require("../models/indexModel");
const userModel = require("../models/userModel");


async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.redirect("/login?error=must include username and password");

    const user = await userModel.findByUsername(username);

    if (!user)
      return res.redirect("/login?error=username or password is incorrect");

    const passwordMatches = await userModel.checkPassword(password, user.password);

    if (!passwordMatches)
      return res.redirect("/login?error=username or password is incorrect");

    req.session.isLoggedIn = true;
    req.session.save(() => res.redirect("/"));
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function logout(req, res) {
  req.session.destroy(() => res.redirect("/"));
}

module.exports = { login, logout };
