const express = require("express");
const path = require("path");
const exphbs  = require("express-handlebars");
const sequelize = require("./config/connection");
const routes = require("./controllers");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const PORT = process.env.PORT || 3000;

const app = express();

const sess = {
  secret: "dogs are great pets",
  cookie: {maxAge: 1200000},
  resave: false,
  saveUninitialized: false,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.use(express.json());
app.use(express.urlencoded({extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(routes);


app.listen(PORT, async () => {
  try {
    await sequelize.sync();
    console.log("All models were synchronized successfully.");
    console.log(`App listening on port ${PORT}!`);
  } catch (err) {
    console.log(err);
  }
});
