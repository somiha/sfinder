const express = require("express");
const { login, postLogin } = require("../../controllers/login.controller");
const loginRouter = express.Router();
const upload = require("../../config/multer");
const isLogged = require("../../middlewares/isLogin");

loginRouter.get("/login", isLogged, login);
loginRouter.post("/login", upload.none(), postLogin);

module.exports = loginRouter;
