var express = require("express");
var router = express.Router();
const axios = require("axios");
const DButils = require("./DButils")
const recipesGetter = require("./search_recipes")

const api_domain = "https://api.spoonacular.com/recipes";
const api_key = "368146e9ec544eb59c837564419c9b6c";

async function getUserInfoOnRecipes(userid, ids) {/// arrays?!
    let promises = [];
    promises.push(await releventDataForUser(ids, userid));

    return promises;
}
async function releventDataForUser(element, userid) {
    let ans = (
        await DButils.execQuery(
            `SELECT recipe_id,watched,favorite FROM dbo.recipe_data_user WHERE user_id = '${userid}' AND recipe_id= '${element}'`
        ));
    return ans;
}
async function checkId(user) {
    const dbuser = (
        await DButils.execQuery(
            `SELECT user_id FROM dbo.users WHERE user_id = '${user}'`
        ));

    return dbuser;
}
async function getLast3Recipes(user_id) {
    const dbuser = (
        await DButils.execQuery(
            `SELECT TOP (3) recipe_id FROM dbo.recipe_data_user WHERE user_id = '${user_id}'`
        ));
    let arr = [];
    dbuser.forEach(element => {
        arr.push(element.recipe_id);
    });
    return await recipesGetter.getRecipesInfo(arr);
}
module.exports = {
    getUserInfoOnRecipes: getUserInfoOnRecipes,
    checkId: checkId,
    getLast3Recipes: getLast3Recipes
}