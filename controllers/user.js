const userModel = require("../models/userModel");
const auth = require("../controllers/auth");

async function create(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.redirect("/signup?error=must include username and password");

    const user = await userModel.create(username, password);

    if (!user) return res.redirect("/signup?error=error creating new user");

    req.session.isLoggedIn = true;
    req.session.userId = user.id;

    req.session.save(() => res.redirect("/"));
  } catch (err) {
    console.log(err);
    return res.redirect(`/signup?error=${err.message}`);
  }
  console.log("SESSION DATA:", req.session);
}



module.exports = { create };
