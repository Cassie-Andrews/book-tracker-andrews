const {book} = require('../models')
const fetch = require('node-fetch')

async function getBooks(req, res) {
    try {
        const books = await book.getAllBooks()
        res.render("index", {books})
        const data = await response.json()
    } catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports = {getBooks}

/*
data.docs.forEach((book) => {
    console.log(`Title: ${book.title}`)
    console.log(`Author(s): ${book.author_name ? book.author_name.join(', ') : 'Unknown'}`)
    console.log(`Genre(s): ${book.subject}`)
*/