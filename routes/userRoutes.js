const express = require('express');
const router = express.Router()
const UserController = require('../controllers/usersController');
const adminAuth = require('../middleware/adminAuth');


router.post("/user", UserController.create);
router.get("/user", UserController.findAll)
router.get("/user/:id", UserController.findById)
router.put("/user/:id", UserController.update)
router.delete("/user/:id", UserController.delete)
router.post("/login", UserController.login);
router.post("/recoverPassword", UserController.sendEmailtoRecoverPassword)
router.post("/changePassword", UserController.changePassword)

module.exports = router