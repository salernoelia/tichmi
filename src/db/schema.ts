import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const todoTable = pgTable("todo", {
  id: serial("id").primaryKey(),
  task: text("task"),
  done: boolean("done").default(false),
});

export const coursesTable = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title"),
  description: text("description"),
  completion_percent: numeric("completion_percent"),
  context: jsonb("context"),
  modules: jsonb("modules"),
});

export const userDataTable = pgTable("user_data", {
  id: serial("id").primaryKey(),
  preferences: jsonb("preferences"),
});

export const quizzesTable = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  topic: text("topic").notNull(),
  cards: jsonb("cards").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const quizResultsTable = pgTable("quiz_results", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").notNull(),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  answers: jsonb("answers").notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});
