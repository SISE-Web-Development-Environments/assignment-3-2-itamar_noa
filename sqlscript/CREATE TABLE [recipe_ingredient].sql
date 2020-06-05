CREATE TABLE [dbo].[ingredients](
	[recipe_id] [UNIQUEIDENTIFIER] NOT NULL ,
	[name] [varchar](300) NOT NULL,
	[unit] [varchar](300) NOT NULL,
    [quantity] [float] NOT NULL,
    PRIMARY KEY (recipe_id),
	FOREIGN KEY (recipe_id) REFERENCES  personal_recipes(recipe_id),
	
)
