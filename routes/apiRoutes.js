const router = require("express").Router();
const { fetchOpenLibraryData } = require("../api/bookApi");
const controllers = require("../controllers");
const { searchAndInsertBooks } = require("../controllers/book");
const checkAuth = require("../middleware/auth");


// admin login/logout
router.post("/login", controllers.auth.login);
router.get("/logout", controllers.auth.logout);
router.post("/signup", controllers.user.create);


// get books
router.get("/search", async (req, res) => {
    const { query } = req.query
    if(!query) {
        return res.redirect("/private")
    }
    
    try {
        const books = await fetchOpenLibraryData(query)
        res.render("private", { books, isLoggedIn: req.session.isLoggedIn })
    } catch(err) {
        console.log("Error fetching results:", err)
        res.status(500).send("Error fetching results:" + err.message)
    }
})


module.exports = router;
