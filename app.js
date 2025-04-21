require("dotenv").config();
const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const db = require("./config/connection");

const apiRoutes = require("./routes/apiRoutes");
const htmlRoutes = require("./routes/htmlRoutes");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionStore = new MySQLStore({
  createDatabaseTable: true
}, db);
app.use(
  session({
    key: "session_cookie",
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

app.use(express.static("./public"));

app.use("/", htmlRoutes);
app.use("/api", apiRoutes);

module.exports = app;