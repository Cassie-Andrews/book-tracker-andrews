const router = require("express").Router();
const { authController, bookController } = require("../controllers");
const checkAuth = require("../middleware/auth");

// home/index route
router.get("/", async ({ session: { isLoggedIn } }, res) => {
  try {
    const books = await bookController.getBooks();
    res.render("index", { books, isLoggedIn });
  } catch(err) {
    res.status(500).send("Error fetching books: " + err.message);
  }
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


// search books
router.get("/search", async (req, res) => {
  const {query} = req.query
  
  if (!query) {
    return res.redirect("/")
  }
  
  try {
    const books = await bookController.searchBooks(query)
    res.render("index", { books, isLoggedIn: req.session.isLoggedIn });
  } catch (err) {
    res.status(500).send("Error fetching search results: " + err.message)
  } 
});


module.exports = router;
