CREATE TABLE [recipes](
	[recipe_id] [UNIQUEIDENTIFIER] NOT NULL default NEWID(),
	[author] [UNIQUEIDENTIFIER] NOT NULL,
	[recipe_name] [varchar](300) NOT NULL,
	[instructions] [varchar](300) NOT NULL,
	[duration] [float] NOT NULL,
	[image] [varchar] NOT NULL,
	[likes] [INTEGER] NOT NULL,
	[vegan] [BIT] NOT NULL,
	[vegeterian] [BIT] NOT NULL,
	[gluten_free] [BIT] NOT NULL,
	[servings] [INTEGER] NOT NULL,
	PRIMARY KEY (recipe_id),
	FOREIGN KEY (author) REFERENCES users(user_id)
)
CREATE TABLE [ingredients](
	[ingredient_id] [UNIQUEIDENTIFIER] NOT NULL  default NEWID(),
    [name] [varchar] NOT NULL,
	PRIMARY KEY (ingredient_id)
)
CREATE TABLE [recipe_ingredient](
	[recipe_id] [UNIQUEIDENTIFIER] NOT NULL ,
	[ingredient_id] [UNIQUEIDENTIFIER] NOT NULL,
    [quantity] [INTEGER] NOT NULL,
    PRIMARY KEY (recipe_id,ingredient_id),
	FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id),
	FOREIGN KEY (ingredient_id) REFERENCES ingredients(ingredient_id)
)

