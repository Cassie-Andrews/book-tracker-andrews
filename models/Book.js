const bcrypt = require("bcrypt");
const db = require("../config/connection");


const book = {
  // get all books
  getAllBooks: () => {
    return db.query('SELECT * FROM books')
      .then(([rows]) => rows)
  },

  //search by author or title
  searchBooks: (query) => {
    return db.query(
      'SELECT * FROM books WHERE title LIKE ? OR author LIKE ?'
      [`${query}`, `${query}`]
    ) .then(([rows]) => rows)
  }
}

module.exports = {book}