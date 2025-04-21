const router = require("express").Router();
const db = require("../config/connection");
const checkAuth = require("../middleware/auth");

const controllers = require("../controllers");
const { fetchOpenLibraryData } = require("../api/bookApi");
const { searchAndInsertBooks } = require("../controllers/book");
const userBookController = require("../controllers/userBook")


// AUTH ROUTES

router.post("/login", controllers.auth.login);
router.get("/logout", controllers.auth.logout);
router.post("/signup", controllers.user.create);


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


// USER BOOKSHELF ROUTES

router.post('/add-to-bookshelf', checkAuth, async (req, res) => {
    const { user_id , book_id, bookshelf } = req.body;

    if (!user_id || !book_id || !bookshelf) {
        return res.status(400).send('Missing required fields');
    }

    const validBookshelves = ['want_to_read', 'currently_reading', 'read']
    if (!validBookshelves.includes(bookshelf)) {
        return res.status(400).send('Invalid bookshelf value');
    }

    try {
        const [existing] = await db.query(
            'SELECT * FROM user_books WHERE users_id = ? AND books_id = ?',
            [user_id, book_id]
        );

        if (existing.length > 0) {
            await db.query(
                'UPDATE user_books SET bookshelf = ? WHERE users_id = ? AND books_id = ?',
                [bookshelf, user_id, book_id]
            );
        } else {
            await db.query (
                'INSERT INTO user_books (users_id, books_id, bookshelf) VALUES (?, ?, ?)',
                [user_id, book_id, bookshelf]
            )
        }

        res.redirect('/private'); // maybe '/back'

    } catch(err) {
        console.error('Error adding book to shelf', err.message);
        res.status(500).send('Server error')
    }
})

module.exports = router;