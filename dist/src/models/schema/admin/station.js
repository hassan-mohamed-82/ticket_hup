"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stations = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
const drizzle_orm_1 = require("drizzle-orm");
const country_1 = require("./country");
const city_1 = require("./city");
const zone_1 = require("./zone");
exports.stations = (0, mysql_core_1.mysqlTable)("stations", {
    id: (0, mysql_core_1.char)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    name: (0, mysql_core_1.varchar)("name", { length: 100 }).notNull(),
    countryId: (0, mysql_core_1.char)("country_id", { length: 36 }).notNull().references(() => country_1.countries.id),
    cityId: (0, mysql_core_1.char)("city_id", { length: 36 }).notNull().references(() => city_1.cities.id),
    zoneId: (0, mysql_core_1.char)("zone_id", { length: 36 }).notNull().references(() => zone_1.zones.id),
    status: (0, mysql_core_1.mysqlEnum)("status", ["active", "inactive"]).default("active"),
    pickup: (0, mysql_core_1.boolean)("pickup").default(false),
    dropoff: (0, mysql_core_1.boolean)("dropoff").default(false),
    createdAt: (0, mysql_core_1.timestamp)("created_at").defaultNow(),
});
