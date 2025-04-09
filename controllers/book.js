const { book } = require('../models')
const fetch = require('node-fetch')
const { fetchOpenLibraryData } = require('../api/bookApi')

// get all books
async function getBooks() {
    return await book.findAll()
}

//search and insert books from API
async function searchAndInsertBooks(query) {
    const booksFromAPI = await fetchOpenLibraryData(query)
    const inserted = []

    //loop through each book
    for (const book of booksFromAPI) {
        const insertID = await book.insertBook(book)
        if (insertId) {
            inserted.push({...book, id: insertID})
        }
    }
    
    return inserted
}

module.exports = { getBooks, searchAndInsertBooks }