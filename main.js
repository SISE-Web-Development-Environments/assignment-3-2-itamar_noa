//  Import importent libraries
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const session = require("client-sessions");
var cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

// Application settings
const app = express();
const port = process.env.PORT;

const corsConfig = {
  origin: true,
  credentials: true,
};

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(logger("dev")); //logger
app.use(express.json()); // parse application/json
app.use(
  session({
    cookieName: "session", // the cookie key name
    secret: "blabla", // the encryption key
    duration: 30 * 60 * 1000, // expired after 20 minutes
    activeDuration: 0, // if expiresIn < activeDuration,
    //the session will be extended by activeDuration milliseconds
    cookie: {
      httpOnly: false,
    },
  })
);

app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, "public"))); //To serve static files such as images, CSS files, and JavaScript files

// app.use(morgan(":method url :status :response-time ms"));
// app.use(
//     session({
//       cookieName: "myCookie",
//       secret: "magicWord24",
//       duration:  10*1000,
//       activeDuration: 0,
//     })
// );

//    Import resources
const user = require("./routes/user");
const recipes = require("./routes/recipes");
const guest = require("./routes/guest");

// For checking server availabilty
app.get("/alive", (req, res) => {
  res.send("Im aliveeeeeeeeeeeeeeeeeeeeeeeeeee");
});

// Routing
app.use("/user", user);
app.use("/recipes", recipes);
app.use("/guest", guest);

//Default Router
app.use((req, res) => {
  res.sendStatus(404);
});

// error middleware
app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500).send({ message: err.message, success: false });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
