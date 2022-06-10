const express = require("express");
const router = express.Router();
const authControler = require('../controller/auth');
const adminControler = require('../controller/admin')



router.get("/", authControler.checkAuthenticatedAdmin, adminControler.getAdmin);
router.post("/activate", authControler.checkAuthenticatedAdmin, adminControler.postActivate);
router.post("/eliminate", authControler.checkAuthenticatedAdmin, adminControler.postEliminate);



module.exports = router;
