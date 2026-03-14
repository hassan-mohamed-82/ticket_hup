
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
import { countries } from "./country";
export const cities = mysqlTable("cities", {
  id: char("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  name: varchar("name", { length: 100 }).notNull(),
  countryId: char("country_id", { length: 36 }).notNull().references(() => countries.id),
  createdAt: timestamp("created_at").defaultNow(),
});

