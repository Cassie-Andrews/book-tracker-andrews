const bookModel = require('../models/bookModel')
const fetch = require('node-fetch')
const { fetchOpenLibraryData } = require('../api/bookApi');
const e = require('express');


//search and insert books from API
async function searchAndInsertBooks(query) {
    const booksFromAPI = await fetchOpenLibraryData(query);
    const inserted = [];

    //loop through each book
    for (const book of booksFromAPI) {
        const title = book.title || "Untitled";
        const author = Array.isArray(book.author_name) && book.author_name.length > 0 ? book.author_name[0] : "Unknown";
        const ol_id = book.id?.replace('/works/', '') || null; // Open Library ID
        const cover = book.cover_i 
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
            : null;
            console.log("Attempting to insert:", {title, author, ol_id, cover})

        try {
            const existing = await bookModel.getBookByOlId(ol_id);

            let dbBook;
            if (!existing) {
                const insertId = await bookModel.insertBook(title, author, ol_id, cover);
                dbBook = { id: insertId, title, author, cover };
            } else {
                dbBook = existing;
            }

            inserted.push(dbBook);

        } catch (err) {
            console.error(`Failed to insert book: ${title}`, err.message);
        }
    }

    console.log("Inserted/found:", inserted);
    return inserted;
}

/*
//insert books from user_books
async function getUserBooks() {
    const getUserBooks = 
}

    //loop through each book
    for (const book of booksFromAPI) {
        const title = book.title || "Untitled";
        const author = book.author || "Unknown";
        const cover = book.cover || null;

        try {
            const insertID = await bookModel.insertBook(title, author, cover)

            if (insertID) {
                inserted.push({...book, id: insertID})
            }

        } catch (err) {
            console.error(`Failed to insert book: ${title}`, err.message)
        }
    }
    
    return inserted
}
*/

module.exports = { searchAndInsertBooks }