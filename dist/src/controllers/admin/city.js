"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectcountry = exports.getCityWithZones = exports.getCitiesWithZones = exports.deleteCity = exports.updateCity = exports.getCityById = exports.getCities = exports.createCity = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const connection_1 = require("../../models/connection");
const BadRequest_1 = require("../../Errors/BadRequest");
const NotFound_1 = require("../../Errors/NotFound");
const schema_1 = require("../../models/schema");
const response_1 = require("../../utils/response");
// ✅ Create City
const createCity = async (req, res) => {
    const { name, countryId } = req.body;
    if (!name) {
        throw new BadRequest_1.BadRequest("name is required");
    }
    if (!countryId) {
        throw new BadRequest_1.BadRequest("countryId is required");
    }
    const country = await connection_1.db
        .select({ id: schema_1.countries.id })
        .from(schema_1.countries)
        .where((0, drizzle_orm_1.eq)(schema_1.countries.id, countryId))
        .limit(1);
    if (country.length === 0) {
        throw new NotFound_1.NotFound("Country not found");
    }
    await connection_1.db.insert(schema_1.cities).values({ name, countryId });
    return (0, response_1.SuccessResponse)(res, { message: "City created successfully" }, 201);
};
exports.createCity = createCity;
// ✅ Get All Cities
const getCities = async (req, res) => {
    const { countryId } = req.query;
    const conditions = [];
    if (typeof countryId === "string") {
        conditions.push((0, drizzle_orm_1.eq)(schema_1.cities.countryId, countryId));
    }
    const cityList = await connection_1.db
        .select({
        id: schema_1.cities.id,
        name: schema_1.cities.name,
        countryId: schema_1.cities.countryId,
        createdAt: schema_1.cities.createdAt,
        country: {
            id: schema_1.countries.id,
            name: schema_1.countries.name,
        },
    })
        .from(schema_1.cities)
        .leftJoin(schema_1.countries, (0, drizzle_orm_1.eq)(schema_1.cities.countryId, schema_1.countries.id))
        .where(conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined)
        .orderBy((0, drizzle_orm_1.desc)(schema_1.cities.createdAt));
    return (0, response_1.SuccessResponse)(res, { cities: cityList }, 200);
};
exports.getCities = getCities;
// ✅ Get City By ID
const getCityById = async (req, res) => {
    const { id } = req.params;
    const city = await connection_1.db
        .select({
        id: schema_1.cities.id,
        name: schema_1.cities.name,
        countryId: schema_1.cities.countryId,
        createdAt: schema_1.cities.createdAt,
        country: {
            id: schema_1.countries.id,
            name: schema_1.countries.name,
        },
    })
        .from(schema_1.cities)
        .leftJoin(schema_1.countries, (0, drizzle_orm_1.eq)(schema_1.cities.countryId, schema_1.countries.id))
        .where((0, drizzle_orm_1.eq)(schema_1.cities.id, id))
        .limit(1);
    if (city.length === 0) {
        throw new NotFound_1.NotFound("City not found");
    }
    return (0, response_1.SuccessResponse)(res, { city: city[0] }, 200);
};
exports.getCityById = getCityById;
// ✅ Update City
const updateCity = async (req, res) => {
    const { id } = req.params;
    const { name, countryId } = req.body;
    const city = await connection_1.db
        .select()
        .from(schema_1.cities)
        .where((0, drizzle_orm_1.eq)(schema_1.cities.id, id))
        .limit(1);
    if (city.length === 0) {
        throw new NotFound_1.NotFound("City not found");
    }
    if (countryId) {
        const country = await connection_1.db
            .select({ id: schema_1.countries.id })
            .from(schema_1.countries)
            .where((0, drizzle_orm_1.eq)(schema_1.countries.id, countryId))
            .limit(1);
        if (country.length === 0) {
            throw new NotFound_1.NotFound("Country not found");
        }
    }
    await connection_1.db
        .update(schema_1.cities)
        .set({
        name: name || city[0].name,
        countryId: countryId || city[0].countryId,
    })
        .where((0, drizzle_orm_1.eq)(schema_1.cities.id, id));
    return (0, response_1.SuccessResponse)(res, { message: "City updated successfully" }, 200);
};
exports.updateCity = updateCity;
// ✅ Delete City
const deleteCity = async (req, res) => {
    const { id } = req.params;
    const city = await connection_1.db
        .select()
        .from(schema_1.cities)
        .where((0, drizzle_orm_1.eq)(schema_1.cities.id, id))
        .limit(1);
    if (city.length === 0) {
        throw new NotFound_1.NotFound("City not found");
    }
    await connection_1.db.delete(schema_1.cities).where((0, drizzle_orm_1.eq)(schema_1.cities.id, id));
    return (0, response_1.SuccessResponse)(res, { message: "City deleted successfully" }, 200);
};
exports.deleteCity = deleteCity;
const getCitiesWithZones = async (req, res) => {
    const cityList = await connection_1.db
        .select({
        id: schema_1.cities.id,
        name: schema_1.cities.name,
        countryId: schema_1.cities.countryId,
        createdAt: schema_1.cities.createdAt,
        country: {
            id: schema_1.countries.id,
            name: schema_1.countries.name,
        },
    })
        .from(schema_1.cities)
        .leftJoin(schema_1.countries, (0, drizzle_orm_1.eq)(schema_1.cities.countryId, schema_1.countries.id))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.cities.createdAt));
    const zoneList = await connection_1.db
        .select({
        id: schema_1.zones.id,
        name: schema_1.zones.name,
        cityId: schema_1.zones.cityId,
    })
        .from(schema_1.zones)
        .orderBy(schema_1.zones.name);
    const citiesWithZones = cityList.map((city) => ({
        id: city.id,
        name: city.name,
        countryId: city.countryId,
        country: city.country,
        createdAt: city.createdAt,
        zones: zoneList.filter((zone) => zone.cityId === city.id),
        zonesCount: zoneList.filter((zone) => zone.cityId === city.id).length,
    }));
    return (0, response_1.SuccessResponse)(res, {
        cities: citiesWithZones,
        totalCities: cityList.length,
        totalZones: zoneList.length,
    }, 200);
};
exports.getCitiesWithZones = getCitiesWithZones;
// ✅ Get Single City With Zones
const getCityWithZones = async (req, res) => {
    const { id } = req.params;
    const city = await connection_1.db
        .select({
        id: schema_1.cities.id,
        name: schema_1.cities.name,
        countryId: schema_1.cities.countryId,
        createdAt: schema_1.cities.createdAt,
        country: {
            id: schema_1.countries.id,
            name: schema_1.countries.name,
        },
    })
        .from(schema_1.cities)
        .leftJoin(schema_1.countries, (0, drizzle_orm_1.eq)(schema_1.cities.countryId, schema_1.countries.id))
        .where((0, drizzle_orm_1.eq)(schema_1.cities.id, id))
        .limit(1);
    if (city.length === 0) {
        throw new NotFound_1.NotFound("City not found");
    }
    const cityZones = await connection_1.db
        .select({
        id: schema_1.zones.id,
        name: schema_1.zones.name,
        createdAt: schema_1.zones.createdAt,
    })
        .from(schema_1.zones)
        .where((0, drizzle_orm_1.eq)(schema_1.zones.cityId, id))
        .orderBy(schema_1.zones.name);
    return (0, response_1.SuccessResponse)(res, {
        city: {
            ...city[0],
            zones: cityZones,
            zonesCount: cityZones.length,
        },
    }, 200);
};
exports.getCityWithZones = getCityWithZones;
const selectcountry = async (req, res) => {
    const countryList = await connection_1.db
        .select({
        id: schema_1.countries.id,
        name: schema_1.countries.name,
    })
        .from(schema_1.countries)
        .orderBy(schema_1.countries.name);
    return (0, response_1.SuccessResponse)(res, { countryList: countryList }, 200);
};
exports.selectcountry = selectcountry;
