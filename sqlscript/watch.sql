CREATE TABLE [recipe_data_user](
	[recipe_id] [UNIQUEIDENTIFIER] NOT NULL,
	[user_id] [UNIQUEIDENTIFIER] NOT NULL,
	[watched] [BIT] NOT NULL,
	[favorite] [BIT] NOT NULL,
	FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id),
	FOREIGN KEY (user_id) REFERENCES users(user_id),
	PRIMARY KEY (user_id, recipe_id)
)