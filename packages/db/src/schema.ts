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
  nominatedBy: text("nominated_by", { length: 100 }),
  nominationPrNumber: integer("nomination_pr_number"),
  endorsers: text("endorsers", { mode: "json" }).$type<string[]>(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});

export const questions = sqliteTable("questions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  issueNumber: integer("issue_number").notNull().unique(),
  issueId: integer("issue_id").notNull(),
  title: text("title", { length: 500 }).notNull(),
  body: text("body"),
  askerHandle: text("asker_handle", { length: 100 }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});

export const candidateResponses = sqliteTable("candidate_responses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  questionId: integer("question_id")
    .notNull()
    .references(() => questions.id),
  candidateId: integer("candidate_id")
    .notNull()
    .references(() => candidates.id),
  response: text("response"),
  commentId: integer("comment_id").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});

export const metadata = sqliteTable("metadata", {
  id: integer("id").primaryKey().$defaultFn(() => 1),
  lastFetchedAt: integer("last_fetched_at", { mode: "timestamp" }),
});
