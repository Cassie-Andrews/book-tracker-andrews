const bookModel = require('../models/bookModel')
const fetch = require('node-fetch')
const { fetchOpenLibraryData } = require('../api/bookApi');
// const e = require('express');


//search and insert books from API
async function searchAndInsertBooks(query) {
    const booksFromAPI = await fetchOpenLibraryData(query);
    const results = [];
    const inserted = [];

    //loop through each book
    for (const book of booksFromAPI) {
        const { title = "Untitled", author = "Unknown", ol_id = null, cover = null } = book;
            
        console.log("Processing:", { title, author, cover, ol_id })

        try {

            let existingBook = null

            if (ol_id) {
                existingBook = await bookModel.getBookByOlId(ol_id)
            }

            if (!existingBook) {
                existingBook = await bookModel.getBookByTitle(title)
            }

            if (existingBook) {
                console.log(`${title} has already been added to the database`)
                results.push(existingBook)
            } else {
                const insertId = await bookModel.insertBook(title, author, cover, ol_id)
                const newBook = { id: insertId, title, author, cover };

                results.push(newBook);
            }
            
        } catch (err) {
            console.error(`Error processing: ${title}`, err.message);
        } 
    }

    console.log("Inserted/found:", inserted);
    return results;
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