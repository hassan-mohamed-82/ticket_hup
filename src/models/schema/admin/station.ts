
import {
  mysqlTable,
  varchar,
  timestamp,
  mysqlEnum,
  char,
  boolean,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { countries } from "./country";
import { cities } from "./city";
import { zones } from "./zone";

export const stations = mysqlTable("stations", {
  id: char("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  name: varchar("name", { length: 100 }).notNull(),
  countryId: char("country_id", { length: 36 }).notNull().references(() => countries.id),
  cityId: char("city_id", { length: 36 }).notNull().references(() => cities.id),
  zoneId: char("zone_id", { length: 36 }).notNull().references(() => zones.id),
  status: mysqlEnum("status", ["active", "inactive"]).default("active"),
  pickup: boolean("pickup").default(false),
  dropoff: boolean("dropoff").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});
