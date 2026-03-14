
import {
  mysqlTable,
  int,
  varchar,
  timestamp,
  mysqlEnum,
  char,
  date,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const countries = mysqlTable("countries", {
  id: char("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
