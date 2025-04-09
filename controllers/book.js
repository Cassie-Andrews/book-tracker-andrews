const {book} = require('../models')
const fetch = require('node-fetch')

async function searchBooks(req, res) {
    try {
        const {query} = req.query
        
        if (!query) {
            return res.redirect('/')
        }
        
        const books = await book.searchBooks(query)
        
        res.render("index", {books})
        
    } catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports = {searchBooks}

/*
data.docs.forEach((book) => {
    console.log(`Title: ${book.title}`)
    console.log(`Author(s): ${book.author_name ? book.author_name.join(', ') : 'Unknown'}`)
    console.log(`Genre(s): ${book.subject}`)
*/