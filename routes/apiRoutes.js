const router = require("express").Router();
const db = require("../config/connection");
const checkAuth = require("../middleware/auth");

const controllers = require("../controllers");
const { fetchOpenLibraryData } = require("../api/bookApi"); 
//use for fetchOpenLibraryData for search results
const { searchAndInsertBooks, removeFromBookshelf, addToBookshelf } = require("../controllers/book"); 
// use searchAndInsertBooks for adding to a bookshelf
const userBookController = require("../controllers/userBook")


// AUTH ROUTES

router.post("/login", controllers.auth.login);
router.get("/logout", controllers.auth.logout);
router.post("/signup", controllers.auth.signup);



// USER BOOKSHELF ROUTES

// add to shelf
router.post('/add-to-bookshelf', checkAuth, async (req, res) => {
    const userId = req.session.userId;
    const { ol_id, title, bookshelf } = req.body;
    
    console.log(userId, req.body);

    if(!userId || (!ol_id && !title) || !bookshelf) {
        return res.status(400).send('Missing required fields')
    }

    try {
        const insertedBooks = await searchAndInsertBooks(ol_id || title);
        const book = insertedBooks[0];

        if(!book || !book.id) {
            return res.status(500).send('Book could not be inserted')
        }

        await addToBookshelf(userId, book.id, bookshelf);

        res.redirect(req.get('Referer' || '/private')); // maybe '/back'?
    } catch(err) {
        console.error('Error adding book to shelf', err.message);
        res.status(500).send('Server error');
    }
});


// remove from shelf
router.post('/remove-from-bookshelf', checkAuth, async (req, res) => {
    const userId = req.session.userId;
    const { book_id } = req.body;

    console.log("User ID:", userId)
    console.log("Book ID:", book_id);

    if (!userId || !book_id) {
        return res.status(400).send('Missing book ID');
    }

    try {
        await removeFromBookshelf(userId, book_id);
        res.redirect(req.get('Referer' || '/private'));     
    } catch(err) {
        console.error('Error removing book', err.message);
        res.status(500).send('Error removing book')
    }
})


// /PRIVATE - DISPLAY BOOKSHELVES
router.get('/private', checkAuth, async (req, res) => {
    const user_id = req.session.userId;

    try {
        const [userBooks] = await db.query(
            `SELECT user_books.id, user_books.bookshelf, books.id AS book_id, books.title, books.author, books.cover FROM user_books JOIN books ON user_books.books_id = books.id WHERE user_books.users_id = ?`,
            [user_id]
        );

        const booksByShelf = {
            currently_reading: [],
            want_to_read: [],
            read: []
        };

        userBooks.forEach(book => {
            booksByShelf[book.bookshelf].push(book);
        });

        res.render ('/private', {
            isLoggedIn: req.session.isLoggedIn,
            booksByShelf
        });

    } catch (err) {
        console.log("Error fetching user bookshelf data:", err);
        res.status(500).send("Error fetching bookshelf data.")
    }
});

// BOOK SEARCH ROUTE

router.get("/search", async (req, res) => {
    const { query } = req.query;
    // if no query, redirect to private w/ error message
    if(!query) {
        return res.redirect("/private?error=No query provided");
    }
    
    try {
        // get book data from api
        const books = await fetchOpenLibraryData(query);
        // render private page w/ book results
        res.render("private", { 
            isLoggedIn: req.session.isLoggedIn,
            books
         })
    } catch(err) {
        console.log("Error fetching results:", err)
        res.status(500).send("Error fetching results:" + err.message)
    }
})

module.exports = router;