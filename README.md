# book-tracker-andrews
An app to track your books! 

## Description
Use unique bookshelves to sort books you want to read, are currently reading, and have previously read. This app uses data from [Open Libray API] (https://openlibrary.org/subjects/api). 

## Routes
### Auth routes
Users must be logged in to fully access the application.
- POST to /signup
- POST to /login
- GET to /logout

### Book routes
Once logged in, users can access the following routes:
- GET to /private - displays user's books on their profile page
- GET to /search - search for books from Open Library API
- POST to /add-to-bookshelf - adds books to user's bookshelves
- POST to /remove-from-bookshelf - removes books from user's bookshelves