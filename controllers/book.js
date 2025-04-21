const bookModel = require('../models/bookModel')
const fetch = require('node-fetch')
const { fetchOpenLibraryData } = require('../api/bookApi');
const db = require('../config/connection');
// const e = require('express');



// add book to bookshelf
async function addToBookshelf(userId, bookId, bookshelf) {
    if (!userId || !bookId || !bookshelf) {
        return res.status(400).send('Missing required fields');
    }

    const validBookshelves = ['want_to_read', 'currently_reading', 'read']
    if (!validBookshelves.includes(bookshelf)) {
        return res.status(400).send('Invalid bookshelf value');
    }

    const [existing] = await db.query(
        'SELECT * FROM user_books WHERE users_id = ? AND books_id = ?',
        [userId, bookId]
    );

    if (existing.length > 0) {
        await db.query(
            'UPDATE user_books SET bookshelf = ? WHERE users_id = ? AND books_id = ?',
            [bookshelf, userId, bookId]
        );
    } else {
        await db.query (
            'INSERT INTO user_books (users_id, books_id, bookshelf) VALUES (?, ?, ?)',
            [userId, bookId, bookshelf]
        )
    } 
};



// remove book from bookshelf
async function removeFromBookshelf(userId, bookId) {
    if (!userId || !bookId) {
        throw new Error('Unable to delete, insufficient information');
    }

    await db.query(
        'DELETE FROM user_books WHERE users_id = ? AND books_id = ?',
        [userId, bookId]
    );    
};



//search and insert books from API
async function searchAndInsertBooks(query) {
    const booksFromAPI = await fetchOpenLibraryData(query);
    const results = [];
    const inserted = [];

    //loop through each book
    for (const book of booksFromAPI) {
        const { 
            title = "Untitled", 
            author = "Unknown", 
            ol_id = null, 
            cover = null 
        } = book;
            
        console.log("Processing:", { title, author, cover, ol_id })

        try {

            let existingBook = null

            if (ol_id) {
                existingBook = await bookModel.getBookByOlId(ol_id)
            }

            if (!existingBook && title) {
                existingBook = await bookModel.getBookByTitle(title)
            }

            if (existingBook) {
                console.log(`${title} has already been added to the database`)
                results.push(existingBook)
            } else {
                const insertId = await bookModel.insertBook(title, author, cover, ol_id)
                const newBook = { id: insertId, title, author, cover, ol_id};

                inserted.push(newBook);
                results.push(newBook);

                console.log(`Inserted new book: ${title}`)
            }
            
        } catch (err) {
            console.error(`Error processing: ${title}`, err.message);
        } 
    }

    console.log("Inserted/found:", results.map(b=> `${b.title} (ID: ${b.id})`));
    return results;
}


module.exports = { searchAndInsertBooks, removeFromBookshelf, addToBookshelf }