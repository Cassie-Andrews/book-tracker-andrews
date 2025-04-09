import { findAll } from '../models/book'
import fetch from 'node-fetch'
import { fetchOpenLibraryData } from '../api/bookApi'

// get all books
async function getBooks() {
    return await findAll()
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

export default { getBooks, searchAndInsertBooks }