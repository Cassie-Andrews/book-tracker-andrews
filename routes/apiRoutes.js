const router = require("express").Router();
const { fetchOpenLibraryData } = require("../api/bookApi");
const controllers = require("../controllers");
const { searchAndInsertBooks } = require("../controllers/book");
const checkAuth = require("../middleware/auth");


// admin login/logout
router.post("/login", controllers.auth.login);
router.get("/logout", controllers.auth.logout);
router.post("/signup", controllers.user.create);


// search books
router.get("/search", async (req, res) => {
    const { query } = req.query
    // if no query, redirect to private w/ error message
    if(!query) {
        return res.redirect("/private?error=No query provided");
    }
    
    try {
        // get book data from api
        const books = await fetchOpenLibraryData(query);
        // render private page w/ book results
        res.render("private", { 
            isLoggedIn: req.session.isLoggedIn,
            books
         })
    } catch(err) {
        // error handling
        console.log("Error fetching results:", err)
        res.status(500).send("Error fetching results:" + err.message)
    }
})

router.post("/add-to-shelf", checkAuth, userBookController.addToShelf);


module.exports = router;
