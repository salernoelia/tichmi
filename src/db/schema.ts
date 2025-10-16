import { boolean, integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const todoTable = pgTable("todo", {
  id: serial("id").primaryKey(),
  task: text("task"),
  done: boolean("done").default(false),
});
