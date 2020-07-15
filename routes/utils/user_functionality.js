var express = require("express");
var router = express.Router();
const axios = require("axios");
const DButils = require("./DButils");
const recipesGetter = require("./search_recipes");

const api_domain = "https://api.spoonacular.com/recipes";
const api_key = "9020471b054d47a69c35d39e47668fa2";

async function getUserInfoOnRecipes(userid, ids) {
  let promises = {};
  for (const key in ids) {
    promises[ids[key]] = await releventDataForUser(ids[key], userid);
  }

  return promises;
}
async function releventDataForUser(element, userid) {
  let ans = await DButils.execQuery(
    `SELECT watched,favorite FROM dbo.recipe_data_user WHERE user_id = '${userid}' AND recipe_id= '${element}'`
  );
  return ans[0];
}
async function checkId(user) {
  const dbuser = await DButils.execQuery(
    `SELECT user_id FROM dbo.users WHERE user_id = '${user}'`
  );

  return dbuser;
}
async function getLast3Recipes(user_id) {
  const dbuser = await DButils.execQuery(
    `SELECT TOP (3) recipe_id FROM dbo.recipe_data_user WHERE user_id = '${user_id}' ORDER BY add_time DESC `
  );
  let arr = [];
  dbuser.forEach((element) => {
    arr.push(element.recipe_id);
  });
  return await recipesGetter.getRecipesInfo(arr);
}
async function getAllFaves(recipe_ids) {
  let arr = [];
  recipe_ids.forEach((element) => {
    arr.push(element.recipe_id);
  });
  return await recipesGetter.getRecipesInfo(arr);
}
module.exports = {
  getUserInfoOnRecipes: getUserInfoOnRecipes,
  checkId: checkId,
  getLast3Recipes: getLast3Recipes,
  getAllFaves: getAllFaves,
};
