const router = require("express").Router();
const db = require('../config/connection');

// POST - add book to bookshelf
router.post('/add-to-bookshelf', async (req, res) => {
    const { user_id, book_id, bookshelf } = req.body;

    if (!user_id || !book_id || !bookshelf) {
        return res.status(400).send('Missing required fields')
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

        res.redirect('back');

    } catch(err) {
        console.error('Error adding book to shelf', err.message);
        res.status(500).send('Server error')
    }
})


// UPDATE - move book from one shelf to another


module.exports = router;
