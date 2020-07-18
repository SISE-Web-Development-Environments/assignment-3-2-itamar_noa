var express = require("express");
var router = express.Router();
const axios = require("axios");

const api_domain = "https://api.spoonacular.com/recipes";
const api_key = "9020471b054d47a69c35d39e47668fa2";

async function get3Random() {
  let promises = await axios.get(
    `${api_domain}/random?apiKey=${api_key}&number=3`
  );
  return promises.data.recipes.map((recipes_info) =>
    extractRelventRecipeData(recipes_info)
  );
}
function extractQueriesParams(query_params, search_param) {
  const param_list = ["diet", "cuisine", "intolerances"];
  param_list.forEach((element) => {
    if (query_params[element]) {
      search_param[element] = query_params[element];
    }
  });

  console.log(search_param);
}

async function getFullRecipe(id) {
  let promise = await axios.get(
    `${api_domain}/${id}/information?apiKey=${api_key}&instructionRequire=true`
  );
  let ans = extractFullRecipeData(promise.data);
  ans.extendedIngredients = ans.extendedIngredients.map(
    ({ name: name, unit: unit, amount: amount }) => ({ name, unit, amount })
  );
  return ans;
}
function extractFullRecipeData(recipe) {
  const {
    id,
    title,
    image,
    readyInMinutes,
    aggregateLikes,
    glutenFree,
    vegan,
    vegetarian,
    extendedIngredients,
    instructions,
    analyzedInstructions,
    servings,
  } = recipe;

  return {
    id: id,
    title: title,
    readyInMinutes: readyInMinutes,
    aggregateLikes: aggregateLikes,
    vegetarian: vegetarian,
    glutenFree: glutenFree,
    vegan: vegan,
    image: image,
    extendedIngredients: extendedIngredients,
    instructions: instructions,
    analyzedInstructions: analyzedInstructions,
    servings: servings,
  };
}

async function getRecipesInfo(recipes_id_list) {
  let promises = [];
  recipes_id_list.forEach((id) =>
    promises.push(
      axios.get(
        `${api_domain}/${id}/information?apiKey=${api_key}&instructionRequire=true`
      )
    )
  );
  let info_respone = await Promise.all(promises);
  return extractRelventRecipeDataSearch(info_respone);
}

async function searchForRecipes(search_param) {
  let search_respone = await axios.get(
    `${api_domain}/search?apiKey=${api_key}`,
    {
      params: search_param,
    }
  );
  const recipes_id_list = extractSearchResultsIds(search_respone);
  console.log(recipes_id_list);
  let info_array = await getRecipesInfo(recipes_id_list);
  console.log(info_array);
  return info_array;
}

function extractRelventRecipeDataSearch(recipes_info) {
  return recipes_info.map((recipes_info) =>
    extractRelventRecipeData(recipes_info.data)
  );
}

function extractRelventRecipeData(recipes_info) {
  const {
    id,
    title,
    image,
    readyInMinutes,
    aggregateLikes,
    glutenFree,
    vegan,
    vegetarian,
  } = recipes_info;
  return {
    id: id,
    title: title,
    readyInMinutes: readyInMinutes,
    aggregateLikes: aggregateLikes,
    vegetarian: vegetarian,
    glutenFree: glutenFree,
    vegan: vegan,
    image: image,
  };
  // map[id] = {
  //   title: title,
  //   readyInMinutes: readyInMinutes,
  //   aggregateLikes: aggregateLikes,
  //   vegetarian: vegetarian,
  //   glutenFree: glutenFree,
  //   vegan: vegan,
  //   image: image,
  // };
  // return map;
}
function extractSearchResultsIds(search_respone) {
  const id_list = [];
  search_respone.data.results.forEach((recipes_info) => {
    id_list.push(recipes_info.id);
  });
  return id_list;
}

module.exports = {
  searchForRecipes: searchForRecipes,
  extractQueriesParams: extractQueriesParams,
  extractRelventRecipeData: extractRelventRecipeData,
  getRecipesInfo: getRecipesInfo,
  getFullRecipe: getFullRecipe,
  get3Random: get3Random,
};
