const {book} = require('../models')
const fetch = require('node-fetch')
const {getOpenLibraryData} = require('../api/bookApi')

async function searchBooks(req, res) {
    const {query} = req.query
    
    if (!query) {
        return res.redirect('/')
    }

    try {    
        const books = await getOpenLibraryData(query)
        res.render("index", {books, isLoggedIn: req.session.isLoggedIn})
    } catch (err) {
        res.status(500).send("Error fetching books: " + err.message)
    }
}

module.exports = {searchBooks}

/*
data.docs.forEach((book) => {
    console.log(`Title: ${book.title}`)
    console.log(`Author(s): ${book.author_name ? book.author_name.join(', ') : 'Unknown'}`)
    console.log(`Genre(s): ${book.subject}`)
*/