const bookModel = require('../models/bookModel')
const fetch = require('node-fetch')
const { fetchOpenLibraryData } = require('../api/bookApi')


//search and insert books from API
async function searchAndInsertBooks(query) {
    const booksFromAPI = await fetchOpenLibraryData(query);
    const inserted = [];

    //loop through each book
    for (const book of booksFromAPI) {
        const title = book.title || "Untitled";
        const author = Array.isArray(book.author_name) ? book.author_name[0] : "Unknown";
        const cover = book.cover_i 
            ? `https://covers.openlibrary.org/b/olid/${book.cover_i}-M.jpg`
            : null;
            console.log("Attempting to insert:", {title, author, cover})

        try {
            const insertID = await bookModel.insertBook(title, author, cover);

            if (insertID) {
                inserted.push({ title, author, cover });
            }

        } catch (err) {
            console.error(`Failed to insert book: ${title}`, err.message);
        }
    }
    console.log("Inserted:", inserted);
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