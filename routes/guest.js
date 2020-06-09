const express = require("express");
const router = express.Router();
const DButils = require("./utils/DButils.js");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res, next) => {
  try {
    const users = await DButils.execQuery("SELECT username FROM dbo.users");
    let username = req.body.username;
    if (users.find((x) => x.username === username)) {
      throw { status: 409, message: "Username taken" };
    }
    if (req.body.passwordconfirm != req.body.password) {
      throw { status: 409, message: "Passwords does not match" };
    }
    // add the new username
    let hash_password = bcrypt.hashSync(
      req.body.password,
      parseInt(process.env.bcrypt_saltRounds)
    );
    await DButils.execQuery(
      `INSERT INTO dbo.users VALUES (default, '${req.body.username}', '${hash_password}','${req.body.firstname}','${req.body.lastname}','${req.body.country}','${req.body.email}','${req.body.profilepic}')`
    );
    res.status(201).send({ message: "user created", success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    // check that username exists
    const users = await DButils.execQuery("SELECT username FROM dbo.users");
    if (!users.find((x) => x.username === req.body.username))
      throw { status: 401, message: "Username or Password incorrect" };

    // check that the password is correct
    const user = (
      await DButils.execQuery(
        `SELECT * FROM dbo.users WHERE username = '${req.body.username}'`
      )
    )[0];

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      throw { status: 401, message: "Username or Password incorrect" };
    }

    // Set cookie
    req.session.user_id = user.user_id;
    // req.session.save();
    // res.cookie(session_options.cookieName, user.user_id, cookies_options);

    // return cookie
    res.status(200).send({ message: "login succeeded", success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", function (req, res) {
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  res.send({ success: true, message: "logout succeeded" });
});

module.exports = router;
