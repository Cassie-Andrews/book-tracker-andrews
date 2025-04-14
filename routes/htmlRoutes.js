const router = require("express").Router();
const { auth, book } = require("../controllers");
const { searchAndInsertBooks } = require("../controllers/book")
const userBookController = require("../controllers/userBook")
const checkAuth = require("../middleware/auth");

// loads homepage, index.handlebars
router.get("/", async ({ session: { isLoggedIn } }, res) => {
  // when logged in, gets all books then displays them
  try {
    const books = await book.searchAndInsertBooks();
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
  // redirects home if query is missing
  if (!query) {
    return res.redirect("/private?error=No query provided")
  }
  // handle search if there is a query and user is logged in
  try {
    const books = await searchAndInsertBooks(query)
    // renders index page with results
    res.render("index", { books, isLoggedIn: req.session.isLoggedIn });
  } catch (err) {
    res.status(500).send("Error fetching search results: " + err.message)
  } 
});

// display bookselves
router.get("/private", checkAuth, async (req, res) => {
  const userId = req.session.userId;
  try {
      // get book data from user_books table
      const bookshelves = await userBookController.getBooksByShelf(userId);
      // render private page w/ book results
      res.render("private", { 
          isLoggedIn: true,
          ...bookshelves
       });
  } catch(err) {
      // error handling
      console.error("Error loading bookshelves:", err.message)
      res.status(500).send("Error loading bookshelves.")
  }
})


module.exports = router;
