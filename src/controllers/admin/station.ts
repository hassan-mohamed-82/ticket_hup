import { Request, Response } from "express";
import { SQL, and, desc, eq } from "drizzle-orm";
import { db } from "../../models/connection";
import { BadRequest } from "../../Errors/BadRequest";
import { NotFound } from "../../Errors/NotFound";
import { stations, countries, cities, zones } from "../../models/schema";
import { SuccessResponse } from "../../utils/response";

// ✅ Create Station
export const createStation = async (req: Request, res: Response) => {
  const { name, countryId, cityId, zoneId, pickup, dropoff } = req.body;

  if (!name) throw new BadRequest("name is required");
  if (!countryId) throw new BadRequest("countryId is required");
  if (!cityId) throw new BadRequest("cityId is required");
  if (!zoneId) throw new BadRequest("zoneId is required");

  const country = await db
    .select()
    .from(countries)
    .where(eq(countries.id, countryId))
    .limit(1);
  if (country.length === 0) throw new NotFound("Country not found");

  const city = await db
    .select()
    .from(cities)
    .where(eq(cities.id, cityId))
    .limit(1);
  if (city.length === 0) throw new NotFound("City not found");

  const zone = await db
    .select()
    .from(zones)
    .where(eq(zones.id, zoneId))
    .limit(1);
  if (zone.length === 0) throw new NotFound("Zone not found");

  await db.insert(stations).values({
    name,
    countryId,
    cityId,
    zoneId,
    pickup: pickup ?? false,
    dropoff: dropoff ?? false,
  });

  return SuccessResponse(res, { message: "Station created successfully" }, 201);
};

// ✅ Get All Stations
export const getStations = async (req: Request, res: Response) => {
  const { countryId, cityId, zoneId } = req.query;

  const conditions: SQL[] = [];
  if (countryId && typeof countryId === "string") {
    conditions.push(eq(stations.countryId, countryId));
  }
  if (cityId && typeof cityId === "string") {
    conditions.push(eq(stations.cityId, cityId));
  }
  if (zoneId && typeof zoneId === "string") {
    conditions.push(eq(stations.zoneId, zoneId));
  }

  const stationList = await db
    .select({
      id: stations.id,
      name: stations.name,
      status: stations.status,
      pickup: stations.pickup,
      dropoff: stations.dropoff,
      createdAt: stations.createdAt,
      country: {
        id: countries.id,
        name: countries.name,
      },
      city: {
        id: cities.id,
        name: cities.name,
      },
      zone: {
        id: zones.id,
        name: zones.name,
      },
    })
    .from(stations)
    .leftJoin(countries, eq(stations.countryId, countries.id))
    .leftJoin(cities, eq(stations.cityId, cities.id))
    .leftJoin(zones, eq(stations.zoneId, zones.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(stations.createdAt));

  return SuccessResponse(res, { stations: stationList }, 200);
};

// ✅ Get Station By ID
export const getStationById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const station = await db
    .select({
      id: stations.id,
      name: stations.name,
      status: stations.status,
      pickup: stations.pickup,
      dropoff: stations.dropoff,
      createdAt: stations.createdAt,
      country: {
        id: countries.id,
        name: countries.name,
      },
      city: {
        id: cities.id,
        name: cities.name,
      },
      zone: {
        id: zones.id,
        name: zones.name,
      },
    })
    .from(stations)
    .leftJoin(countries, eq(stations.countryId, countries.id))
    .leftJoin(cities, eq(stations.cityId, cities.id))
    .leftJoin(zones, eq(stations.zoneId, zones.id))
    .where(eq(stations.id, id))
    .limit(1);

  if (station.length === 0) {
    throw new NotFound("Station not found");
  }

  return SuccessResponse(res, { station: station[0] }, 200);
};

// ✅ Update Station
export const updateStation = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, countryId, cityId, zoneId, status, pickup, dropoff } = req.body;

  const station = await db
    .select()
    .from(stations)
    .where(eq(stations.id, id))
    .limit(1);

  if (station.length === 0) {
    throw new NotFound("Station not found");
  }

  if (countryId) {
    const country = await db
      .select()
      .from(countries)
      .where(eq(countries.id, countryId))
      .limit(1);
    if (country.length === 0) throw new NotFound("Country not found");
  }

  if (cityId) {
    const city = await db
      .select()
      .from(cities)
      .where(eq(cities.id, cityId))
      .limit(1);
    if (city.length === 0) throw new NotFound("City not found");
  }

  if (zoneId) {
    const zone = await db
      .select()
      .from(zones)
      .where(eq(zones.id, zoneId))
      .limit(1);
    if (zone.length === 0) throw new NotFound("Zone not found");
  }

  await db
    .update(stations)
    .set({
      name: name || station[0].name,
      countryId: countryId || station[0].countryId,
      cityId: cityId || station[0].cityId,
      zoneId: zoneId || station[0].zoneId,
      status: status || station[0].status,
      pickup: pickup !== undefined ? pickup : station[0].pickup,
      dropoff: dropoff !== undefined ? dropoff : station[0].dropoff,
    })
    .where(eq(stations.id, id));

  return SuccessResponse(res, { message: "Station updated successfully" }, 200);
};

// ✅ Delete Station
export const deleteStation = async (req: Request, res: Response) => {
  const { id } = req.params;

  const station = await db
    .select()
    .from(stations)
    .where(eq(stations.id, id))
    .limit(1);

  if (station.length === 0) {
    throw new NotFound("Station not found");
  }

  await db.delete(stations).where(eq(stations.id, id));

  return SuccessResponse(res, { message: "Station deleted successfully" }, 200);
};

// ✅ Get Stations Selection
export const getStationsSelection = async (req: Request, res: Response) => {
  const { zoneId } = req.query;

  const conditions: SQL[] = [];
  if (zoneId && typeof zoneId === "string") {
    conditions.push(eq(stations.zoneId, zoneId));
  }

  const stationList = await db
    .select({
      id: stations.id,
      name: stations.name,
    })
    .from(stations)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(stations.name);

  return SuccessResponse(res, { stations: stationList }, 200);
};
