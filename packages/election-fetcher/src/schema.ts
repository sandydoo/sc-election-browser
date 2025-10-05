import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const candidates = sqliteTable("candidates", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  githubHandle: text("github_handle", { length: 100 }).notNull().unique(),
  name: text("name", { length: 200 }).notNull(),
  email: text("email", { length: 200 }).notNull(),
  discourseHandle: text("discourse_handle", { length: 100 }),
  matrixHandle: text("matrix_handle", { length: 200 }),
  conflictOfInterest: text("conflict_of_interest"),
  motivation: text("motivation"),
  personalStatement: text("personal_statement"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});
