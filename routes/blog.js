const express = require("express");
const router = express.Router();
const authControler = require('../controller/auth');




router.get("/article-1", authControler.getUserToRequest, (req, res) => {
    res.render(`blog/article_1`);
});


router.get("/article-2", authControler.getUserToRequest, (req, res) => {
    res.render(`blog/article_2`);
});

module.exports = router;
