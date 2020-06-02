const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";
// be in .env file 
const api_key = "apiKey=9dfadfa642a74094836f8a3d38d80db2";
const express = require("express");
const router = express.Router();

function extreactQueriesParams(query_params,search_params){

  const params_list=["diet", "cuisine", "intolerance"];
  params_list.forEach((param)=> {
    if(query_params[param]){
      search_params[param]=query_params[param];
    }
  });  
  console.log(search_params);
}

async function searchForRecipes(searchQuery,num,search_params){
    let search_response = await axios.get(
        '${api_domain}/search?${api_key}',
        {
        param: search_params,
        }
    );
        const recipes_id_list = extractSearchResultsIds(search_response);
        console.log(recipes_id_list);
        let info_array = await getRecipesInfo(recipes_id_list);
        console.log("info_array: ",info_array);
        return info_array;
}

async function getRecipesInfo(recipes_id_list) {
  let promises = [];
 
  recipes_id_list.map((id) =>
    promises.push(axios.get(`${api_domain}/${id}/information?${api_key}`))
  );
  let info_response1 = await Promise.all(promises);
  relevantRecipesData = extractRelevantRecipeData(info_response1);
  return relevantRecipesData;
}

function extractRelevantRecipeData(recipes_Info) {
  return recipes_Info.map((recipe_info) => {
    const {
      id,
      title,
      readyInMinutes,
      aggregateLikes,
      vegetarian,
      vegan,
      glutenFree,
      image,
    } = recipe_info.data;

    return { 
      id: id,
      title: title,
      readyInMinutes: readyInMinutes,
      aggregateLikes: aggregateLikes,
      vegetarian: vegetarian,
      vegan: vegan,
      glutenFree: glutenFree,
      image: image,
    };
  });
}

let promiseAll = async function (func, param_list) {
  let promises = [];
  param_list.map((param) => promises.push(func(param)));
  let info_response = await Promise.all(promises);

  return info_response;
};

function extractSearchResultsIds(search_response){
    let recipes = search_response.data.results;
    recipes_id_list = [];
    recipes.map((recipe)=>{
        console.log(recipe.title);
        recipes_id_list.push(recipe.id);

    });
    return recipes_id_list;
}


//example !
getRecipesInfo([492560, 559251, 630293]).then(console.log);
// exports.searchForRecipes = searchForRecipes;
// exports.extractQueriesParams = extractQueriesParams;