CREATE TABLE [users](
	[user_id] [UNIQUEIDENTIFIER] PRIMARY KEY NOT NULL default NEWID(),
	[username] [varchar](30) NOT NULL UNIQUE,
	[password] [varchar](300) NOT NULL,
	[firstname] [varchar](300) NOT NULL,
	[lastname] [varchar](300) NOT NULL,
	[country] [varchar](300) NOT NULL,
	[email] [varchar](300) NOT NULL,
	[profilepic] [varchar](300) NOT NULL

)

