import { Request, Response } from "express";
import { SQL, and, desc, eq } from "drizzle-orm";
import { db } from "../../models/connection";
import { BadRequest } from "../../Errors/BadRequest";
import { NotFound } from "../../Errors/NotFound";
import { cities, countries, zones } from "../../models/schema";
import { SuccessResponse } from "../../utils/response";

// ✅ Create City
export const createCity = async (req: Request, res: Response) => {
  const { name, countryId } = req.body;

  if (!name) {
    throw new BadRequest("name is required");
  }

  if (!countryId) {
    throw new BadRequest("countryId is required");
  }

  const country = await db
    .select({ id: countries.id })
    .from(countries)
    .where(eq(countries.id, countryId))
    .limit(1);

  if (country.length === 0) {
    throw new NotFound("Country not found");
  }

  await db.insert(cities).values({ name, countryId });

  return SuccessResponse(res, { message: "City created successfully" }, 201);
};

// ✅ Get All Cities
export const getCities = async (req: Request, res: Response) => {
  const { countryId } = req.query;

  const conditions: SQL[] = [];
  if (typeof countryId === "string") {
    conditions.push(eq(cities.countryId, countryId));
  }

  const cityList = await db
    .select({
      id: cities.id,
      name: cities.name,
      countryId: cities.countryId,
      createdAt: cities.createdAt,
      country: {
        id: countries.id,
        name: countries.name,
      },
    })
    .from(cities)
    .leftJoin(countries, eq(cities.countryId, countries.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(cities.createdAt));

  return SuccessResponse(res, { cities: cityList }, 200);
};

// ✅ Get City By ID
export const getCityById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const city = await db
    .select({
      id: cities.id,
      name: cities.name,
      countryId: cities.countryId,
      createdAt: cities.createdAt,
      country: {
        id: countries.id,
        name: countries.name,
      },
    })
    .from(cities)
    .leftJoin(countries, eq(cities.countryId, countries.id))
    .where(eq(cities.id, id))
    .limit(1);

  if (city.length === 0) {
    throw new NotFound("City not found");
  }

  return SuccessResponse(res, { city: city[0] }, 200);
};

// ✅ Update City
export const updateCity = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, countryId } = req.body;

  const city = await db
    .select()
    .from(cities)
    .where(eq(cities.id, id))
    .limit(1);

  if (city.length === 0) {
    throw new NotFound("City not found");
  }

  if (countryId) {
    const country = await db
      .select({ id: countries.id })
      .from(countries)
      .where(eq(countries.id, countryId))
      .limit(1);

    if (country.length === 0) {
      throw new NotFound("Country not found");
    }
  }

  await db
    .update(cities)
    .set({
      name: name || city[0].name,
      countryId: countryId || city[0].countryId,
    })
    .where(eq(cities.id, id));

  return SuccessResponse(res, { message: "City updated successfully" }, 200);
};

// ✅ Delete City
export const deleteCity = async (req: Request, res: Response) => {
  const { id } = req.params;

  const city = await db
    .select()
    .from(cities)
    .where(eq(cities.id, id))
    .limit(1);

  if (city.length === 0) {
    throw new NotFound("City not found");
  }

  await db.delete(cities).where(eq(cities.id, id));

  return SuccessResponse(res, { message: "City deleted successfully" }, 200);
};


export const getCitiesWithZones = async (req: Request, res: Response) => {
  const cityList = await db
    .select({
      id: cities.id,
      name: cities.name,
      countryId: cities.countryId,
      createdAt: cities.createdAt,
      country: {
        id: countries.id,
        name: countries.name,
      },
    })
    .from(cities)
    .leftJoin(countries, eq(cities.countryId, countries.id))
    .orderBy(desc(cities.createdAt));

  const zoneList = await db
    .select({
      id: zones.id,
      name: zones.name,
      cityId: zones.cityId,
    })
    .from(zones)
    .orderBy(zones.name);

  const citiesWithZones = cityList.map((city) => ({
    id: city.id,
    name: city.name,
    countryId: city.countryId,
    country: city.country,
    createdAt: city.createdAt,
    zones: zoneList.filter((zone) => zone.cityId === city.id),
    zonesCount: zoneList.filter((zone) => zone.cityId === city.id).length,
  }));

  return SuccessResponse(res, {
    cities: citiesWithZones,
    totalCities: cityList.length,
    totalZones: zoneList.length,
  }, 200);
};

// ✅ Get Single City With Zones
export const getCityWithZones = async (req: Request, res: Response) => {
  const { id } = req.params;
  const city = await db
    .select({
      id: cities.id,
      name: cities.name,
      countryId: cities.countryId,
      createdAt: cities.createdAt,
      country: {
        id: countries.id,
        name: countries.name,
      },
    })
    .from(cities)
    .leftJoin(countries, eq(cities.countryId, countries.id))
    .where(eq(cities.id, id))
    .limit(1);

  if (city.length === 0) {
    throw new NotFound("City not found");
  }

  const cityZones = await db
    .select({
      id: zones.id,
      name: zones.name,
      createdAt: zones.createdAt,
    })
    .from(zones)
    .where(eq(zones.cityId, id))
    .orderBy(zones.name);

  return SuccessResponse(res, {
    city: {
      ...city[0],
      zones: cityZones,
      zonesCount: cityZones.length,
    },
  }, 200);
};


export const selectcountry=async(req:Request,res:Response)=>{
  const countryList = await db
  .select({
    id: countries.id,
    name: countries.name,
  })
  .from(countries)
  .orderBy(countries.name);
  return SuccessResponse(res, { countryList: countryList }, 200);
}