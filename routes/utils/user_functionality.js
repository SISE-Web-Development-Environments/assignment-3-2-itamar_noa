var express = require("express");
var router = express.Router();
const axios = require("axios");
const DButils = require("./DButils")


const api_domain ="https://api.spoonacular.com/recipes";
const api_key ="368146e9ec544eb59c837564419c9b6c";

function getUserInfoOnRecipes(userid,ids){/// arrays?!
    let promises= [];
    ids.forEach(element => {
        promises.push(releventDataForUser(element,userid));
    });
}
function releventDataForUser(element,userid){
    const dbuser = (
        await DButils.execQuery(
          `SELECT recipe_id,watched,favorite FROM dbo.recipe_data_user WHERE user_id = '${userid}' AND recipe_id= '${element}'`
        ));
    return dbuser;
}
async  function checkId(user){
    const dbuser = (
        await DButils.execQuery(
          `SELECT user_id FROM dbo.users WHERE user_id = '${user}'`
        ));
    return dbuser;    
}

module.exports ={
    getUserInfoOnRecipes: getUserInfoOnRecipes,
    checkId : checkId
}