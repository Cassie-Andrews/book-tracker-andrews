const bcrypt = require("bcrypt");
const db = require("../config/connection");

async function findByTitle(title) {
  const [[book]] = await db.query(
    `SELECT * FROM books WHERE title=?`,
    title
  );
  return title;
}
/*
async function create(username, password) {
  const hashedPass = await bcrypt.hash(password, 10);

  await db.query(`INSERT INTO users (username, password) VALUES (?, ?)`, [
    username,
    hashedPass,
  ]);

  return findByUsername(username);
}
*/
// hashes the password before it's stored in mongo

module.exports = {
  //create,
  //checkPassword,
  findByTitle,
};
