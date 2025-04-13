const router = require("express").Router();
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
    if(!query) return res.status(400).send("No query")
    
    try {
        const books = await searchAndInsertBooks(query)
        res.json(books)
    } catch(err) {
        res.status(500).send(err.message)
    }
})


module.exports = router;
