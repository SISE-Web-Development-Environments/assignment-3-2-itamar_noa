const express = require("express");
const router = express.Router();
var app = express();

const search_util = require("./utils/search_recipes");

router.use((req, res, next) => {
  console.log("Recipes route");
  next();
});

router.get("/search/query/:searchQuery/amount/:num", (req, res, next) => {
  const { searchQuery, num } = req.params;
  console.log(req.params);
  // set search params
  search_params = {};
  search_params.query = searchQuery;
  search_params.number = num;
  search_params.instructionsRequired = true;
  console.log(req.query);

  search_util.extractQueriesParams(req.query, search_params);

  search_util
    .searchForRecipes(search_params)
    .then((info_array) => res.status(200).send(info_array))
    .catch(function (error) {
      next(error);
    });
});
router.get("/recipepage/:id", (req, res, next) => {
  const { id } = req.params;
  searchid = id;
  search_util
    .getFullRecipe(searchid)
    .then((info_array) => res.status(200).send(info_array))
    .catch(function (error) {
      next(error);
    });
});
router.get("/randomrecipe", (req, res, next) => {
  search_util
    .get3Random()
    .then((info_array) => res.status(200).send(info_array))
    .catch(function (error) {
      next(error);
    });
});
app.use(function (err, req, res, next) {
  res
    .status(err.status || 500)
    .send({ message: err.message || "Some thing went wrong", success: false });
});

module.exports = router;
// module.exports = getRecipeInfo();
