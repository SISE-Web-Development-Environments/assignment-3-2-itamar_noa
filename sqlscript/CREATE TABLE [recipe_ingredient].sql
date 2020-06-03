CREATE TABLE [dbo].[recipe_ingredient](
	[recipe] [UNIQUEIDENTIFIER] NOT NULL ,
	[ingredient] [UNIQUEIDENTIFIER] NOT NULL,
    [quantity] [INTEGER] NOT NULL,
    PRIMARY KEY (recipe, ingredient),
	FOREIGN KEY (recipe) REFERENCES  recipes(recipe_id),
	FOREIGN KEY (ingredient) REFERENCES  ingredients(ingredient_id)
)
