const db = require('../config/connection')

// add a book to a shelf
async function addToShelf(req, res) {
    // we need: book id, shelf "id", user id
    const { book_id, bookshelf } = req.body;
    const user_id = req.session.userId;

    try {
        await db.query(
            `INSERT INTO user_books (user_id, book_id, bookshelf) VALUES (?, ?, ?)`,
            [user_id, book_id, bookshelf]
        )
        res.redirect('/private');
    } catch(err) {
        console.error('Error adding to shelf:', err.message);
        res.status(500).send('Error adding book to shelf');
    }
}

module.exports = { addToShelf }