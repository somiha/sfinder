const express = require("express");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const apiRouter = require("./routers/api.router/allRouters");
const adminRouter = require("./routers/admin.router/allRouter");

const app = express();
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(bodyparser.raw());
app.use(cookieParser());

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.use("/api", apiRouter);
app.use("/admin", adminRouter);
app.get("/", (req, res) => {
  res.send("Hello S Finder");
});

const PORT = 3005;
app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
