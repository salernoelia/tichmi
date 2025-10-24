import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { todoTable, quizzesTable, quizResultsTable } from "../db/schema";
import { eq } from "drizzle-orm";

export function usePGLite() {
  const client = new PGlite("idb://tichmi");
  const db = drizzle({ client });

  async function createTables() {
    try {
      await client.exec(`
        CREATE TABLE IF NOT EXISTS todo (
          id SERIAL PRIMARY KEY,
          task TEXT,
          done BOOLEAN DEFAULT false
        );

        CREATE TABLE IF NOT EXISTS quizzes (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          topic TEXT NOT NULL,
          cards JSONB NOT NULL,
          created_at TIMESTAMP DEFAULT NOW() NOT NULL,
          updated_at TIMESTAMP DEFAULT NOW() NOT NULL
        );

        CREATE TABLE IF NOT EXISTS quiz_results (
          id SERIAL PRIMARY KEY,
          quiz_id INTEGER NOT NULL,
          score INTEGER NOT NULL,
          total_questions INTEGER NOT NULL,
          answers JSONB NOT NULL,
          completed_at TIMESTAMP DEFAULT NOW() NOT NULL
        );
      `);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchAllData() {
    return await db.select({ id: todoTable.id }).from(todoTable);
  }

  async function getAllQuizzes() {
    return await db.select().from(quizzesTable);
  }

  async function getQuizById(id: number) {
    const result = await db
      .select()
      .from(quizzesTable)
      .where(eq(quizzesTable.id, id));
    return result[0];
  }

  async function createQuiz(title: string, topic: string, cards: any) {
    const result = await db
      .insert(quizzesTable)
      .values({
        title,
        topic,
        cards,
      })
      .returning();
    return result[0];
  }

  async function deleteQuiz(id: number) {
    await db.delete(quizzesTable).where(eq(quizzesTable.id, id));
    await db.delete(quizResultsTable).where(eq(quizResultsTable.quizId, id));
  }

  async function saveQuizResult(
    quizId: number,
    score: number,
    totalQuestions: number,
    answers: any
  ) {
    const result = await db
      .insert(quizResultsTable)
      .values({
        quizId,
        score,
        totalQuestions,
        answers,
      })
      .returning();
    return result[0];
  }

  async function getQuizResults(quizId: number) {
    return await db
      .select()
      .from(quizResultsTable)
      .where(eq(quizResultsTable.quizId, quizId));
  }

  return {
    fetchAllData,
    createTables,
    db,
    getAllQuizzes,
    getQuizById,
    createQuiz,
    deleteQuiz,
    saveQuizResult,
    getQuizResults,
  };
}
