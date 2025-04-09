const router = require("express").Router();
const {authController, bookController} = require("../controllers");
const checkAuth = require("../middleware/auth");

/* book list -> add this to the protected page? or switch profile content from protected page to index

router.get("/", checkAuth, async (req, res) => {
  try {
    const books = await bookController.getBooks()
    res.render("index", { books, isLoggedIn: req.session.isLoggedIn });
  } catch (err) {
    res.status(500).send(err.message)
  } 
});
*/


router.get("/", ({ session: { isLoggedIn } }, res) => {
  res.render("index", { isLoggedIn });
});


// login
router.get("/login", async (req, res) => {
  if (req.session.isLoggedIn) return res.redirect("/");
  res.render("login", { error: req.query.error });
});

// signup
router.get("/signup", async (req, res) => {
  if (req.session.isLoggedIn) return res.redirect("/");
  res.render("signup", { error: req.query.error });
});


// private route
router.get("/private", checkAuth, ({ session: { isLoggedIn } }, res) => {
  res.render("protected", { isLoggedIn });
});

module.exports = router;
