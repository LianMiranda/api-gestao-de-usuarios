const express = require('express');
const app = express()
const router = express.Router()
const HomeController = require("../controllers/HomeController")
const UserController = require('../controllers/UsersController');

router.get("/", HomeController.index);
router.post("/user", UserController.create);
router.get("/user", UserController.findAll)
router.get("/user/:id", UserController.findById)
router.put("/user/:id", UserController.update)
router.delete("/user/:id", UserController.delete)

module.exports = router