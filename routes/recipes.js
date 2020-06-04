
const express = require("express");
const router = express.Router();

const search_util = require("./utils/search_recipes");

router.use((req,res,next)=>{
    console.log("Recipes route");
    next();
});

router.get('/search/query/:searchQuery/amount/:num', (req, res, next) => {
    const { searchQuery, num } = req.params;
    console.log(req.params);
    // set search params
    search_params = {};
    search_params.query = searchQuery;
    search_params.number = num;
    search_params.instructionsRequired = true;

    console.log(req.query);

    search_util.extractQueriesParams(req.query,search_params);

    search_util
    .searchForRecipes(search_params)
    .then((info_array) => res.status(200).send(info_array))
    .catch(function (error) {
        next(error);
      });
});
router.get('/recipepage/:id', (req, res) => {
    const {id} = req.params;
    searchid = id;
    search_util
    .getFullRecipe(searchid)
    .then((info_array) => res.status(200).send(info_array))
    .catch(function (error) {
        next(error);
      });
});



// router.get("/Information", async (req, res, next) => {
//   try {
//     const recipe = await getRecipeInfo(req.query.recipe_id);
//     res.send({ data: recipe.data });
//   } catch (error) {
//     next(error);
//   }
// });

// router.get("/search", async (req, res, next) => {
//   try {
//     const { query, cuisine, diet, intolerances, number } = req.query;
//     const search_response = await axios.get(`${api_domain}/search`, {
//       params: {
//         query: query,
//         cuisine: cuisine,
//         diet: diet,
//         intolerances: intolerances,
//         number: number,
//         instructionsRequired: true,
//         apiKey: process.env.spooncular_apiKey
//       }
//     });
//     let recipes = await Promise.all(
//       search_response.data.results.map((recipe_raw) =>
//         getRecipeInfo(recipe_raw.id)
//       )
//     );
//     recipes = recipes.map((recipe) => recipe.data);
//     res.send({ data: recipes });
//   } catch (error) {
//     next(error);
//   }
// });

// function getRecipeInfo(id) {
//   return axios.get(`${api_domain}/${id}/information`, {
//     params: {
//       includeNutrition: false,
//       apiKey: process.env.spooncular_apiKey
//     }
//   });
// }

module.exports = router;
// module.exports = getRecipeInfo();
