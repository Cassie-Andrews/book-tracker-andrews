const bcrypt = require("bcrypt");
const db = require("../config/connection");

// find all books
async function findAll() {
    const [rows] = await db.query('SELECT * FROM books');
    return rows;
}


// get book by ol_id
async function getBookByOlId(ol_id) {
  const [rows] = await db.query(
    'SELECT * FROM books WHERE ol_id = ?',
    [ol_id]
  );
  return rows[0] || null;
}


// get book by title
async function getBookByTitle(title) {
  const [rows] = await db.query(
    'SELECT * FROM books WHERE title = ?',
    [title]
  );
  return rows[0] || null;
}


// insert book
async function insertBook(title, author, cover, ol_id) {
  const [result] = await db.query (
    'INSERT INTO books (title, author, cover, ol_id) VALUES (?, ?, ?, ?)',
    [title, author, cover, ol_id]
  );

  return result.insertId;
}


module.exports = { 
  insertBook, 
  findAll,
  getBookByOlId,
  getBookByTitle
};