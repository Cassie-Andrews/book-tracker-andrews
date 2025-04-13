const router = require("express").Router();
const { auth, book } = require("../controllers");
const checkAuth = require("../middleware/auth");

// loads homepage, index.handlebars
router.get("/", async ({ session: { isLoggedIn } }, res) => {
  // when logged in, gets all books then displays them
  try {
    const books = await book.getBooks();
    res.render("index", { books, isLoggedIn });
  } catch(err) {
    res.status(500).send("Error fetching books: " + err.message);
  }
});


// renders login page
router.get("/login", async (req, res) => {
  // if user is already logged in, redirect to profile
  if (req.session.isLoggedIn) return res.redirect("/private");
  // error handling
  res.render("login", { error: req.query.error });
});


// renders signup page
router.get("/signup", async (req, res) => {
  if (req.session.isLoggedIn) return res.redirect("/");
  // error handling
  res.render("signup", { error: req.query.error });
});


// private route that renders private.handlebars
router.get("/private", checkAuth, ({ session: { isLoggedIn } }, res) => {
  res.render("private", { isLoggedIn });
});


// search books
router.get("/search", async (req, res) => {
  const {query} = req.query
  
  if (!query) {
    return res.redirect("/")
  }
  
  try {
    const books = await book.searchBooks(query)
    res.render("index", { books, isLoggedIn: req.session.isLoggedIn });
  } catch (err) {
    res.status(500).send("Error fetching search results: " + err.message)
  } 
});


module.exports = router;
