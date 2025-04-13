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
        const inserted = await searchAndInsertBooks(query)
        res.json({ message: "Books added", count: inserted.length, inserted })
    } catch(err) {
        res.status(500).send(err.message)
    }
})


module.exports = router;
