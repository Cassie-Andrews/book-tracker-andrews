const db = require('../config/connection')


// add a book to a shelf
async function addToShelf(req, res) {
    // we need: book id, shelf "id", user id
    const { book_id, bookshelf } = req.body;
    const user_id = req.session.userId;

    try {
        const [existing] = await db.query(
            `SELECT * FROM user_books WHERE user_id = ? AND book_id = ?`,
            [user_id, book_id]
        );

        if (existing.length > 0) {
            // handle updating a book that's already shelved
            await db.query(
                `UPDATE user_books SET bookshelf = ? WHERE user_id = ? AND book_id = ?`,
                [bookshelf, user_id, book_id]
            );
        } else {
            // insert a new book to a shelf
            await db.query(
                `INSERT INTO user_books (user_id, book_id, bookshelf) VALUES (?, ?, ?)`,
                [user_id, book_id, bookshelf]
            );
        }
            
        res.redirect('/private');

    } catch(err) {
        console.error('Error adding to shelf:', err.message);
        res.status(500).send('Error adding book to shelf');
    }
}

// get books by shelf from user_books
async function getBooksByShelf(userId) {
    const [rows] = await db.query(
        `SELECT books.*, user_books.bookshelf
        FROM user_books
        JOIN books ON user_books.book_id = books.id
        WHERE user_books.user_id = ?`,
        [userId]
    );
    // filter by bookshelf
    //('want_to_read', 'reading', 'read')
    return {
        wantToRead: rows.filter(b => b.bookshelf === 'want_to_read'),
        currentlyReading: rows.filter(b => b.bookshelf === 'reading'),
        read: rows.filter(b => b.bookshelf === 'read')
    };    
}

module.exports = { addToShelf, getBooksByShelf }