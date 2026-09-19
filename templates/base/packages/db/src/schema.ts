import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const outbox = pgTable("outbox", {
  id: text("id").primaryKey(),
  eventType: text("event_type").notNull(),
  payload: text("payload").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});
