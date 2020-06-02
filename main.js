//  Import importent libraries
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
var session = require('express-session');
var cookieParser = require("cookie-parser")



// Application settings
const app = express();
const port = 3000;


app.use(cookieParser());
app.use(session({secret: "This is a secret"}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
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
// const auth = require("./routes/auth");
const user = require("./routes/user");
const recipes = require("./routes/recipes");


// For checking server availabilty
app.get("/alive",(req,res) => {
    res.send("Im aliveeeeeeeeeeeeeeeeeeeeeeeeeee");
});


// Routing
app.use("/user", user);
app.use("/recipes", recipes);
// app.use(auth); //without prefix! 

//Default Router
app.use((req,res) => {
res.sendStatus(404);
});

// error middleware
app.use(function (err, req, res, next) {
    console.error(err);
    res.status(500).send({ message: err.message, success: false });
  });

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
