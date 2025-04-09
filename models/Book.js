const bcrypt = require("bcrypt");
const db = require("../config/connection");

// find all books
async function findAll() {
  const [rows] = await db.query('SELECT * FROM books')
  return rows
}


// insert book
async function insertBook(book) {
  const { title, author, genre, cover } = book

  const [result] = await db.query(
    'INSERT INTO books (title, author, genre, cover) VALUES (?, ?, ?, ?)'
    [title, author, genre, cover]
  )
}

return result.insertBook

module.exports = { findAll, insertBook }