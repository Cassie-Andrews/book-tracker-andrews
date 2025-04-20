const fetch = require('node-fetch')


// get books from api
async function fetchOpenLibraryData(query) {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&mode=everything&limit=4`

    try {
        const response = await fetch(url);
        const data = await response.json();
            console.log('JSON response: ', data.docs);
        
        return data.docs
            .filter(book => book.title) // only use books with a title
            .map((book) => ({
                title: book.title,
                author: Array.isArray(book.author_name) ? book.author_name[0] : "Unknown",
                ol_id: book.key?.replace("/works/", "") || null,
                cover: book.cover_i
                    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null
                // Use the olid (Open Library ID) for authors and books to fetch covers by olid, e.g. https://covers.openlibrary.org/b/id/OL23919A-M.jpg
            }));
    } catch(err) {
        console.error("Error fetching data from API", err.message);
        throw err;
    }
}


module.exports = { fetchOpenLibraryData }

