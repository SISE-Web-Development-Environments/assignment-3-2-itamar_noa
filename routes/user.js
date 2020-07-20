const express = require("express");
const router = express.Router();
const axios = require("axios");
const CryptoJS = require("crypto-js");
const DButils = require("./utils/DButils");
const bcrypt = require("bcrypt");

const user_util = require("./utils/user_functionality");

router.use(async (req, res, next) => {
  if (req.session && req.session.user_id) {
    const id = req.session.user_id;
    const user = await user_util.checkId(id);
    if (user) {
      req.user = user[0].user_id;
      next();
    }
  } else {
    res.sendStatus(401);
  }
});
router.get("/lastseen", async (req, res) => {
  const user_id = req.user;
  let info = await user_util.getLast3Recipes(user_id);
  if (info.length > 0) {
    res.send(info);
  } else {
    res.sendStatus(204);
  }
});
router.get("/recipeInfo/:ids", async (req, res) => {
  ids = JSON.parse(req.params.ids);
  const user_id = req.user;
  let info = await user_util.getUserInfoOnRecipes(user_id, ids);
  res.send(info);
});

router.post("/addFavoriteRecipe", async (req, res) => {
  const rec_id = req.body.id;
  const user_id = req.user;
  const valforfave = true;
  let returnVal = await DButils.execQuery(
    `SELECT user_id from dbo.recipe_data_user WHERE user_id ='${user_id}' AND recipe_id= '${rec_id}'`
  );
  if (returnVal.length == 1) {
    await DButils.execQuery(
      `UPDATE dbo.recipe_data_user set favorite = '${valforfave}' where user_id ='${user_id}' AND recipe_id= '${rec_id}'`
    );
  } else {
    await DButils.execQuery(
      `INSERT INTO dbo.recipe_data_user VALUES ('${rec_id}','${user_id}',${1},${1},GETDATE())`
    );
  }
  res.send({ success: true, message: "recipe added succsessfully" });
});
router.get("/getFavorites", async (req, res) => {
  const user_id = req.user;
  let faveIds = await DButils.execQuery(
    `SELECT recipe_id from dbo.recipe_data_user WHERE user_id ='${user_id}' AND favorite= ${1}`
  );
  if (faveIds.length > 0) {
    let ans = await user_util.getAllFaves(faveIds);
    res.send(ans);
  } else {
    res.sendStatus(204);
  }
});

router.post("/addWatch", async (req, res) => {
  const rec_id = req.body.id;
  const user_id = req.user;
  const checkit = await DButils.execQuery(
    `SELECT recipe_id from dbo.recipe_data_user WHERE user_id ='${user_id}' AND watched= ${1} AND recipe_id = '${rec_id}'`
  );
  if (checkit.length > 0) {
    await DButils.execQuery(
      `UPDATE dbo.recipe_data_user set add_time = GETDATE() where user_id ='${user_id}' AND recipe_id= '${rec_id}'`
    );
    res.send({ success: true, message: "recipe updated succsessfully" });
  } else {
    await DButils.execQuery(
      `INSERT INTO dbo.recipe_data_user VALUES ('${rec_id}','${user_id}',${1},${0},GETDATE())`
    );
    res.send({ success: true, message: "recipe added succsessfully" });
  }
});
router.get("/getpersonalrecipes", async (req, res) => {
  const user_id = req.user;
  let returnVal = await DButils.execQuery(`SELECT  recipe_id,recipe_name,duration,image 
    from dbo.personal_recipes
    WHERE user_id ='${user_id}' AND family=${0}`);
  if (returnVal.length == 0) {
    res.sendStatus(204);
  } else {
    res.send(returnVal);
  }
});
router.get("/getfamilyrecipes", async (req, res) => {
  const user_id = req.user;
  let returnVal = await DButils.execQuery(
    `SELECT dbo.personal_recipes.recipe_id,dbo.personal_recipes.recipe_name,dbo.personal_recipes.duration,dbo.personal_recipes.image,dbo.family_recipes.author,dbo.family_recipes.occasions from dbo.personal_recipes,dbo.family_recipes WHERE dbo.personal_recipes.recipe_id=dbo.family_recipes.recipe_id AND dbo.personal_recipes.user_id ='${user_id}' AND family=${1}`
  );
  if (returnVal.length == 0) {
    res.sendStatus(204);
  } else {
    res.send(returnVal);
  }
});
router.get("/fullPersonalRecipe/:id", async (req, res) => {
  const { id } = req.params;
  recipeId = id;
  const user_id = req.user;
  let ans = {};
  let returnVal = await DButils.execQuery(`SELECT recipe_name,duration,image,instructions 
    from dbo.personal_recipes
    WHERE user_id ='${user_id}' AND recipe_id='${recipeId}' AND family=${0}`);
  if (returnVal.length == 0) {
    res.sendStatus(401);
  } else {
    let ingredients = await DButils.execQuery(
      `SELECT name,unit,quantity FROM dbo.ingredients WHERE dbo.ingredients.recipe_id ='${id}' `
    );
    returnVal[0].ingredients = ingredients;
    ans = returnVal[0];
    res.send(ans);
  }
});
router.get("/fullFamilyRecipe/:id", async (req, res) => {
  const { id } = req.params;
  recipeId = id;
  const user_id = req.user;
  let ans = {};
  let returnVal = await DButils.execQuery(`SELECT dbo.personal_recipes.recipe_name,dbo.personal_recipes.duration,dbo.personal_recipes.image,dbo.family_recipes.author,dbo.family_recipes.occasions,dbo.personal_recipes.instructions 
  from dbo.personal_recipes,dbo.family_recipes
   WHERE dbo.personal_recipes.recipe_id=dbo.family_recipes.recipe_id AND dbo.personal_recipes.user_id ='${user_id}' AND dbo.personal_recipes.recipe_id='${recipeId}' AND family=${1}`);

  if (returnVal.length == 0) {
    res.sendStatus(401);
  } else {
    let ingredients = await DButils.execQuery(`SELECT name,unit,quantity FROM 
    dbo.ingredients WHERE 
    dbo.ingredients.recipe_id ='${id}' `);
    returnVal[0].ingredients = ingredients;
    ans = returnVal[0];
    res.send(ans);
  }
});

module.exports = router;
