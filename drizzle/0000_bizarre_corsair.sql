CREATE TABLE `candidate_responses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`question_id` integer NOT NULL,
	`candidate_id` integer NOT NULL,
	`response` text,
	`comment_id` integer NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`candidate_id`) REFERENCES `candidates`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `candidate_responses_comment_id_unique` ON `candidate_responses` (`comment_id`);--> statement-breakpoint
CREATE TABLE `candidates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`github_handle` text(100) NOT NULL,
	`name` text(200) NOT NULL,
	`email` text(200) NOT NULL,
	`discourse_handle` text(100),
	`matrix_handle` text(200),
	`conflict_of_interest` text,
	`motivation` text,
	`nominated_by` text(100),
	`nomination_pr_number` integer,
	`endorsers` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `candidates_github_handle_unique` ON `candidates` (`github_handle`);--> statement-breakpoint
CREATE TABLE `questions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`issue_number` integer NOT NULL,
	`issue_id` integer NOT NULL,
	`title` text(500) NOT NULL,
	`body` text,
	`asker_handle` text(100),
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `questions_issue_number_unique` ON `questions` (`issue_number`);