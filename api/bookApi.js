const fetch = require('node-fetch')

// api link
const openlibraryapi_url = 'https://openlibrary.org/search.json'

// get books from api
async function fetchOpenLibraryData(query) {
    const url = `${openlibraryapi_url}?q=${encodeURIComponent(query)}`

    try {
        const response = await fetch(url);
            console.log('API Response: ', response);
        const data = await response.json();
            console.log('JSON response: ', data);
        
        return data.docs
            // .filter(book => book.title) // only use books with a title
            .map((book) => ({
                title: book.title || "Untitled",
                author: Array.isArray(book.author_name) ? book.author_name[0] : "Unknown",
                cover: book.cover_i
                    ? `https://covers.openlibrary.org/b/${book.cover_i}-M.jpg` : null
                // Use the olid (Open Library ID) for authors and books to fetch covers by olid, e.g. https://covers.openlibrary.org/a/olid/OL23919A-M.jpg
        }))
    } catch(err) {
        console.error("Error fetching data from API", err.message);
        throw err;
    }
}


module.exports = { fetchOpenLibraryData }

