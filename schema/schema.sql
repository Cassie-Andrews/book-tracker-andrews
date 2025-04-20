CREATE DATABASE if NOT EXISTS book_tracker;

USE book_tracker;

CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE books (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
  title VARCHAR(255) NOT NULL UNIQUE,
  author VARCHAR(255) NOT NULL,
  ol_id VARCHAR(255),
  cover VARCHAR(255)
);

CREATE TABLE user_books (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  users_id INT,
  books_id INT, 
  --books_ol_id VARCHAR(255) UNIQUE,
  bookshelf ENUM('want_to_read', 'reading', 'read') NOT NULL,
  rating INT,
  FOREIGN KEY (users_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (books_id) REFERENCES books(id) ON DELETE CASCADE,
  -- FOREIGN KEY (books_ol_id) REFERENCES books(ol_id)
);