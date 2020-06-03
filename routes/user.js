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
      req.user=user;
      next();
    }
  }else{
     res.sendStatus(401);   
  }
});

router.get("/recipeInfo/:ids",(req,res)=>{
  const ids = JSON.parse(req.params.ids);
  const user_id = req.user;
  let info = user_util.getUserInfoOnRecipes(user_id,ids);
  res.send(info);
});





module.exports = router;
