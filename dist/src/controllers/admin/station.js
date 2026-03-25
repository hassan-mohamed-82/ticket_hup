"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStationsSelection = exports.deleteStation = exports.updateStation = exports.getStationById = exports.getStations = exports.createStation = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const connection_1 = require("../../models/connection");
const BadRequest_1 = require("../../Errors/BadRequest");
const NotFound_1 = require("../../Errors/NotFound");
const schema_1 = require("../../models/schema");
const response_1 = require("../../utils/response");
// ✅ Create Station
const createStation = async (req, res) => {
    const { name, countryId, cityId, zoneId, pickup, dropoff } = req.body;
    if (!name)
        throw new BadRequest_1.BadRequest("name is required");
    if (!countryId)
        throw new BadRequest_1.BadRequest("countryId is required");
    if (!cityId)
        throw new BadRequest_1.BadRequest("cityId is required");
    if (!zoneId)
        throw new BadRequest_1.BadRequest("zoneId is required");
    const country = await connection_1.db
        .select()
        .from(schema_1.countries)
        .where((0, drizzle_orm_1.eq)(schema_1.countries.id, countryId))
        .limit(1);
    if (country.length === 0)
        throw new NotFound_1.NotFound("Country not found");
    const city = await connection_1.db
        .select()
        .from(schema_1.cities)
        .where((0, drizzle_orm_1.eq)(schema_1.cities.id, cityId))
        .limit(1);
    if (city.length === 0)
        throw new NotFound_1.NotFound("City not found");
    const zone = await connection_1.db
        .select()
        .from(schema_1.zones)
        .where((0, drizzle_orm_1.eq)(schema_1.zones.id, zoneId))
        .limit(1);
    if (zone.length === 0)
        throw new NotFound_1.NotFound("Zone not found");
    await connection_1.db.insert(schema_1.stations).values({
        name,
        countryId,
        cityId,
        zoneId,
        pickup: pickup ?? false,
        dropoff: dropoff ?? false,
    });
    return (0, response_1.SuccessResponse)(res, { message: "Station created successfully" }, 201);
};
exports.createStation = createStation;
// ✅ Get All Stations
const getStations = async (req, res) => {
    const { countryId, cityId, zoneId } = req.query;
    const conditions = [];
    if (countryId && typeof countryId === "string") {
        conditions.push((0, drizzle_orm_1.eq)(schema_1.stations.countryId, countryId));
    }
    if (cityId && typeof cityId === "string") {
        conditions.push((0, drizzle_orm_1.eq)(schema_1.stations.cityId, cityId));
    }
    if (zoneId && typeof zoneId === "string") {
        conditions.push((0, drizzle_orm_1.eq)(schema_1.stations.zoneId, zoneId));
    }
    const stationList = await connection_1.db
        .select({
        id: schema_1.stations.id,
        name: schema_1.stations.name,
        status: schema_1.stations.status,
        pickup: schema_1.stations.pickup,
        dropoff: schema_1.stations.dropoff,
        createdAt: schema_1.stations.createdAt,
        country: {
            id: schema_1.countries.id,
            name: schema_1.countries.name,
        },
        city: {
            id: schema_1.cities.id,
            name: schema_1.cities.name,
        },
        zone: {
            id: schema_1.zones.id,
            name: schema_1.zones.name,
        },
    })
        .from(schema_1.stations)
        .leftJoin(schema_1.countries, (0, drizzle_orm_1.eq)(schema_1.stations.countryId, schema_1.countries.id))
        .leftJoin(schema_1.cities, (0, drizzle_orm_1.eq)(schema_1.stations.cityId, schema_1.cities.id))
        .leftJoin(schema_1.zones, (0, drizzle_orm_1.eq)(schema_1.stations.zoneId, schema_1.zones.id))
        .where(conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined)
        .orderBy((0, drizzle_orm_1.desc)(schema_1.stations.createdAt));
    return (0, response_1.SuccessResponse)(res, { stations: stationList }, 200);
};
exports.getStations = getStations;
// ✅ Get Station By ID
const getStationById = async (req, res) => {
    const { id } = req.params;
    const station = await connection_1.db
        .select({
        id: schema_1.stations.id,
        name: schema_1.stations.name,
        status: schema_1.stations.status,
        pickup: schema_1.stations.pickup,
        dropoff: schema_1.stations.dropoff,
        createdAt: schema_1.stations.createdAt,
        country: {
            id: schema_1.countries.id,
            name: schema_1.countries.name,
        },
        city: {
            id: schema_1.cities.id,
            name: schema_1.cities.name,
        },
        zone: {
            id: schema_1.zones.id,
            name: schema_1.zones.name,
        },
    })
        .from(schema_1.stations)
        .leftJoin(schema_1.countries, (0, drizzle_orm_1.eq)(schema_1.stations.countryId, schema_1.countries.id))
        .leftJoin(schema_1.cities, (0, drizzle_orm_1.eq)(schema_1.stations.cityId, schema_1.cities.id))
        .leftJoin(schema_1.zones, (0, drizzle_orm_1.eq)(schema_1.stations.zoneId, schema_1.zones.id))
        .where((0, drizzle_orm_1.eq)(schema_1.stations.id, id))
        .limit(1);
    if (station.length === 0) {
        throw new NotFound_1.NotFound("Station not found");
    }
    return (0, response_1.SuccessResponse)(res, { station: station[0] }, 200);
};
exports.getStationById = getStationById;
// ✅ Update Station
const updateStation = async (req, res) => {
    const { id } = req.params;
    const { name, countryId, cityId, zoneId, status, pickup, dropoff } = req.body;
    const station = await connection_1.db
        .select()
        .from(schema_1.stations)
        .where((0, drizzle_orm_1.eq)(schema_1.stations.id, id))
        .limit(1);
    if (station.length === 0) {
        throw new NotFound_1.NotFound("Station not found");
    }
    if (countryId) {
        const country = await connection_1.db
            .select()
            .from(schema_1.countries)
            .where((0, drizzle_orm_1.eq)(schema_1.countries.id, countryId))
            .limit(1);
        if (country.length === 0)
            throw new NotFound_1.NotFound("Country not found");
    }
    if (cityId) {
        const city = await connection_1.db
            .select()
            .from(schema_1.cities)
            .where((0, drizzle_orm_1.eq)(schema_1.cities.id, cityId))
            .limit(1);
        if (city.length === 0)
            throw new NotFound_1.NotFound("City not found");
    }
    if (zoneId) {
        const zone = await connection_1.db
            .select()
            .from(schema_1.zones)
            .where((0, drizzle_orm_1.eq)(schema_1.zones.id, zoneId))
            .limit(1);
        if (zone.length === 0)
            throw new NotFound_1.NotFound("Zone not found");
    }
    await connection_1.db
        .update(schema_1.stations)
        .set({
        name: name || station[0].name,
        countryId: countryId || station[0].countryId,
        cityId: cityId || station[0].cityId,
        zoneId: zoneId || station[0].zoneId,
        status: status || station[0].status,
        pickup: pickup !== undefined ? pickup : station[0].pickup,
        dropoff: dropoff !== undefined ? dropoff : station[0].dropoff,
    })
        .where((0, drizzle_orm_1.eq)(schema_1.stations.id, id));
    return (0, response_1.SuccessResponse)(res, { message: "Station updated successfully" }, 200);
};
exports.updateStation = updateStation;
// ✅ Delete Station
const deleteStation = async (req, res) => {
    const { id } = req.params;
    const station = await connection_1.db
        .select()
        .from(schema_1.stations)
        .where((0, drizzle_orm_1.eq)(schema_1.stations.id, id))
        .limit(1);
    if (station.length === 0) {
        throw new NotFound_1.NotFound("Station not found");
    }
    await connection_1.db.delete(schema_1.stations).where((0, drizzle_orm_1.eq)(schema_1.stations.id, id));
    return (0, response_1.SuccessResponse)(res, { message: "Station deleted successfully" }, 200);
};
exports.deleteStation = deleteStation;
// ✅ Get Stations Selection
const getStationsSelection = async (req, res) => {
    const { zoneId } = req.query;
    const conditions = [];
    if (zoneId && typeof zoneId === "string") {
        conditions.push((0, drizzle_orm_1.eq)(schema_1.stations.zoneId, zoneId));
    }
    const stationList = await connection_1.db
        .select({
        id: schema_1.stations.id,
        name: schema_1.stations.name,
    })
        .from(schema_1.stations)
        .where(conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined)
        .orderBy(schema_1.stations.name);
    return (0, response_1.SuccessResponse)(res, { stations: stationList }, 200);
};
exports.getStationsSelection = getStationsSelection;
