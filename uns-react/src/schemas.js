import { schema } from "normalizr";

export const postSchema = new schema.Entity(
	"posts",
	{},
	{ idAttribute: "_id" }
);