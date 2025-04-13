const bcrypt = require("bcrypt");
const db = require("../config/connection");

// find all books
const books = {
  async findAll() {
    const [rows] = await db.query('SELECT * FROM books');
    return rows;
  },

  // insert book
  async insertBook(title, author, genre, cover) {
    const query = `
      INSERT INTO books (title, author, genre, cover) 
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [title, author, genre, cover]);
    return result.insertID;
  }
}

module.exports = books;