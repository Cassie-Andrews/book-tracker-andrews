const router = require("express").Router();
const { auth, book } = require("../controllers");
const { searchAndInsertBooks } = require("../controllers/book")
const userBookController = require("../controllers/userBook")
const checkAuth = require("../middleware/auth");




/* INDEX aka HOMEPAGE ROUTE */

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




/* LOGIN ROUTE */

// renders login page
router.get("/login", async (req, res) => {
  // if user is already logged in, redirect to profile
  if (req.session.isLoggedIn) return res.redirect("/private");
  // error handling
  res.render("login", { error: req.query.error });
});




/* SIGNUP ROUTE */

// renders signup page
router.get("/signup", async (req, res) => {
  if (req.session.isLoggedIn) return res.redirect("/");
  // error handling
  res.render("signup", { error: req.query.error });
});




/* PRIVATE ROUTE */

// private route that renders private.handlebars // display bookselves
router.get("/private", checkAuth, async (req, res) => {
  const { query } = req.query;
  const userId = req.session.userId;
  const isLoggedIn = req.session.isLoggedIn;

  try {
    let searchResults = [];
    // get book data from user_books table
    if (query) {
      console.log("Searching for:", query);
      searchResults = await searchAndInsertBooks(query);
      console.log("Search results:", searchResults);
    }

    const bookshelves = await userBookController.getBooksByShelf(userId);
    console.log("Bookshelves for ", userId, "include: ", bookshelves)

    // render private page w/ book results
    res.render("private", { 
        isLoggedIn,
        query,
        books: searchResults,
        ...bookshelves
     });

  } catch(err) {
      // error handling
      console.error("Error loading /private: ", err.message)
      res.status(500).send("Error loading /private")
  }
});




/* SEARCH ROUTE 

// search books
router.get("/search", checkAuth, async (req, res) => {
  const { query } = req.query
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

*/



module.exports = router;
