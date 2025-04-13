const bcrypt = require("bcrypt");
const db = require("../config/connection");

// find all books
const books = {
  async findAll() {
    const [rows] = await db.query('SELECT * FROM books');
    return rows;
  },

  // insert book
  async insertBook(title, author, cover) {
    const query = `
      INSERT INTO books (title, author, cover) 
      VALUES (?, ?, ?)
    `;
    const [result] = await db.query(query, [title, author, cover]);
    return result.insertID;
  }
}

module.exports = books;