const bcrypt = require("bcrypt");
const db = require("../config/connection");

// find all books
const books = {
  async findAll() {
    const [rows] = await db.query('SELECT * FROM books');
    return rows;
  },

  // insert book
  async insertBook(title, author, cover, ol_id) {
    const [result] = await db.query (
      'INSERT INTO books (title, author, cover, ol_id) VALUES (?, ?, ?, ?)'
      [title, author, cover, ol_id]
    );

    return result.insertId;
  }
}

// get book by ol_id
async function getBookByOlId(ol_id) {
  const [rows] = await db.query(
    'SELECT * FROM books WHERE ol_id = ?',
    [ol_id]
  );
  return rows[0] || null;
}

module.exports = { books, getBookByOlId };