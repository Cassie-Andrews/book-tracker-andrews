const fetch = require('node-fetch')
const {book} = require('../models')
const { query } = require('../config/connection')

// api link
const openlibraryapi_url = 'https://openlibrary.org/search.json'

// get books from api
async function getOpenLibraryData() {
    try {
        const url = `${openlibraryapi_url}?q=${query}` // not sure this url construction is correct
        const response = await fetch(url)

        const data = await response.json()
        const books = data.docs.map(book => ({
            title: book.title,
            author: book.author_name,
            genre: book.subject,
            // You can use the olid (Open Library ID) for authors and books to fetch covers by olid, e.g. https://covers.openlibrary.org/a/olid/OL23919A-M.jpg
            cover: book.cover
        }))

        return books
    } catch(err) {
        console.log(err)
        res.status(500).send(err.message)
    }
}


module.exports = {getOpenLibraryData}

