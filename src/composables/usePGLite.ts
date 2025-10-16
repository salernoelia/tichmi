import { ref } from "vue";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { todoTable } from "../db/schema";

export function usePGLite() {
  const client = new PGlite("idb://tichmi");
  const db = drizzle({ client });
  const data = ref();

  async function createTables() {
    try {
      await client.exec(`
            CREATE TABLE IF NOT EXISTS todo (
                id SERIAL PRIMARY KEY,
                task TEXT,
                done BOOLEAN DEFAULT false
            );
            INSERT INTO todo (task, done) VALUES ('Install PGlite from NPM', true);
            INSERT INTO todo (task, done) VALUES ('Load PGlite', true);
            INSERT INTO todo (task, done) VALUES ('Create a table', true);
            INSERT INTO todo (task, done) VALUES ('Insert some data', true);
            INSERT INTO todo (task) VALUES ('Update a task');
            `);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchData() {
    return await db.select({ id: todoTable.id }).from(todoTable);
  }

  return { data, fetchData, createTables };
}
