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





module.exports = router;
