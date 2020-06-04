const express = require("express");
const router = express.Router();
const axios = require("axios");
const CryptoJS = require("crypto-js");
const DButils = require("./utils/DButils")
const bcrypt = require("bcrypt");

const user_util = require("./utils/user_functionality");

router.use(async(req,res,next)=>{
  if(req.session && req.session.id){
    const id = req.session.user_id;
    const user =await user_util.checkId(id);
    if(user){
      req.user=user[0].user_id;
      next();
    }
  }else{
     res.sendStatus(401);   
  }
});
router.get('/lastseen', async(req, res) => {
  const user_id = req.user;
  let info = await user_util.getLast3Recipes(user_id);
  res.send(info);

});
router.get("/recipeInfo/:ids",async(req,res)=>{
  ids = JSON.parse(req.params.ids);
  const user_id = req.user;
  let info = await user_util.getUserInfoOnRecipes(user_id,ids);
  res.send(info);
});

router.post('/addFavoriteRecipe',async(req,res)=>{
  const rec_id= req.body.id;
  const user_id =req.user;
  const valforfave = true;
  let returnVal = await DButils.execQuery(`SELECT user_id from dbo.recipe_data_user WHERE user_id ='${user_id}' AND recipe_id= '${rec_id}'`);
  if(returnVal.length==1){
    await DButils.execQuery(`UPDATE dbo.recipe_data_user set favorite = '${valforfave}' where user_id ='${user_id}' AND recipe_id= '${rec_id}'`);
  }
  else{
    await DButils.execQuery(`INSERT INTO dbo.recipe_data_user VALUES ('${rec_id}','${user_id}',${1},${1})`);
  }
  res.send({ success: true, message: "recipe added succsessfully" });
});

router.post("/addWatch",async(req,res)=>{
  const rec_id= req.body.id;
  const user_id =req.user;
  await DButils.execQuery(`INSERT INTO dbo.recipe_data_user VALUES ('${rec_id}','${user_id}',${1},${0})`);
  res.send({ success: true, message: "recipe added succsessfully" });

});
router.get('/getpersonalrecipes', async(req, res) => {
    const  user_id = req.user;
    let returnVal = await DButils.execQuery(`SELECT * from dbo.personal_recipes WHERE user_id ='${user_id}'`);
    if(returnVal.length==0){
      res.sendStatus(401);
    }
    else{
      res.send(returnVal);
    }
});
router.get('/getfamilyrecipes', async(req, res) => {
  const  user_id = req.user;
  let returnVal = await DButils.execQuery(`SELECT dbo.personal_recipes.recipe_name,dbo.personal_recipes.instructions,dbo.personal_recipes.duration,dbo.personal_recipes.image,dbo.family_recipes.author,dbo.family_recipes.occasions from dbo.personal_recipes,dbo.family_recipes WHERE dbo.personal_recipes.user_id ='${user_id}' AND family=${1}`);
  if(returnVal.length==0){
    res.sendStatus(401);
  }
  else{
    res.send(returnVal);
  }
});






module.exports = router;
