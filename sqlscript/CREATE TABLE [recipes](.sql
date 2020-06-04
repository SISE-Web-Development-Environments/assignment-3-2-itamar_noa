CREATE TABLE [personal_recipes](
	[recipe_id] [UNIQUEIDENTIFIER] NOT NULL default NEWID(),
	[user_id] [UNIQUEIDENTIFIER] NOT NULL,
	[recipe_name] [varchar](300) NOT NULL,
	[instructions] [varchar](300) NOT NULL,
	[family] [BIT] NOT NULL,
	[duration] [float] NOT NULL,
	[image] [varchar] NOT NULL,
	PRIMARY KEY (recipe_id),
	FOREIGN KEY (user_id) REFERENCES users(user_id)
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
	FOREIGN KEY (recipe_id) REFERENCES personal_recipes(recipe_id),
	FOREIGN KEY (ingredient_id) REFERENCES ingredients(ingredient_id)
)
CREATE TABLE [family_recipes](
	[recipe_id] [UNIQUEIDENTIFIER] NOT NULL default NEWID(),
	[author] [varchar](300) NOT NULL,
	[occasions] [varchar](300)NOT NULL,
	PRIMARY KEY (recipe_id),
	FOREIGN KEY (recipe_id) REFERENCES personal_recipes(recipe_id)
)
