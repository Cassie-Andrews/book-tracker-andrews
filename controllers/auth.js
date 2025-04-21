const indexModel = require("../models/indexModel");
const userModel = require("../models/userModel");


async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.redirect("/login?error=must include username and password");
    }

    const user = await userModel.findByUsername(username);

    if (!user) {
      return res.redirect("/login?error=username or password is incorrect");
    }

    const passwordMatches = await userModel.checkPassword(password, user.password);

    if (!passwordMatches) {
      return res.redirect("/login?error=username or password is incorrect");
    }
    
    req.session.isLoggedIn = true;
    req.session.userId = user.id;

    req.session.save(() => {
      console.log("Session userId:", req.session.userId);
      res.redirect("/private");
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
}




async function signup(req, res) {
  try {
    const { username, password } = req.body;

    // must include a username AND password, return error if not
    if (!username || !password)
      return res.redirect("/signup?error=must include username and password")

    // check if user already exists - if yes, return error, redirect to login
    const existingUser = await userModel.findByUsername(username);
    if (existingUser)
        return res.redirect("/signup?error=username already exists")

    // if username and password are valid AND new - create a new user
    const newUser = await userModel.create(username, password)

    req.session.isLoggedIn = true;
    req.session.userId = newUser.id;
    req.session.save(() => res.redirect("/private"));
  } catch (err) {
    res.status(500).send(err.message);
  }
}



async function logout(req, res) {
  req.session.destroy(() => res.redirect("/"));
}




module.exports = { login, logout, signup };