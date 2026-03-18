"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBusType = exports.updateBusType = exports.createBusType = exports.getBusTypeById = exports.getAllBusTypes = void 0;
const BadRequest_1 = require("../../Errors/BadRequest");
const connection_1 = require("../../models/connection");
const drizzle_orm_1 = require("drizzle-orm");
const response_1 = require("../../utils/response");
const Bustype_1 = require("../../models/schema/admin/Bustype");
const getAllBusTypes = async (req, res) => {
    const busTypeList = await connection_1.db.select().from(Bustype_1.busTypes);
    return (0, response_1.SuccessResponse)(res, { busTypes: busTypeList }, 200);
};
exports.getAllBusTypes = getAllBusTypes;
const getBusTypeById = async (req, res) => {
    const { Id } = req.params;
    if (!Id) {
        throw new BadRequest_1.BadRequest("Please Enter Bus Type Id");
    }
    const busType = await connection_1.db
        .select()
        .from(Bustype_1.busTypes)
        .where((0, drizzle_orm_1.eq)(Bustype_1.busTypes.id, Id))
        .limit(1);
    if (busType.length === 0) {
        throw new BadRequest_1.BadRequest("Bus Type not found");
    }
    return (0, response_1.SuccessResponse)(res, { message: "Bus Type retrieved successfully", busType: busType[0] }, 200);
};
exports.getBusTypeById = getBusTypeById;
const createBusType = async (req, res) => {
    const { name, capacity, description } = req.body;
    if (!name || !capacity) {
        throw new BadRequest_1.BadRequest("Missing required fields");
    }
    const newBusType = await connection_1.db.insert(Bustype_1.busTypes).values({
        name,
        capacity,
        description
    });
    return (0, response_1.SuccessResponse)(res, { message: "Bus Type created successfully" }, 201);
};
exports.createBusType = createBusType;
const updateBusType = async (req, res) => {
    const { Id } = req.params;
    const { name, capacity, description, status } = req.body;
    if (!Id) {
        throw new BadRequest_1.BadRequest("Please Enter Bus Type Id");
    }
    const existingBusType = await connection_1.db
        .select()
        .from(Bustype_1.busTypes)
        .where((0, drizzle_orm_1.eq)(Bustype_1.busTypes.id, Id))
        .limit(1);
    if (existingBusType.length === 0) {
        throw new BadRequest_1.BadRequest("Bus Type not found");
    }
    await connection_1.db.update(Bustype_1.busTypes).set({
        name: name || existingBusType[0].name,
        capacity: capacity || existingBusType[0].capacity,
        description: description || existingBusType[0].description,
        status: status || existingBusType[0].status,
    }).where((0, drizzle_orm_1.eq)(Bustype_1.busTypes.id, Id));
    return (0, response_1.SuccessResponse)(res, { message: "Bus Type updated successfully" }, 200);
};
exports.updateBusType = updateBusType;
const deleteBusType = async (req, res) => {
    const { Id } = req.params;
    if (!Id) {
        throw new BadRequest_1.BadRequest("Please Enter Bus Type Id");
    }
    const existingBusType = await connection_1.db
        .select()
        .from(Bustype_1.busTypes)
        .where((0, drizzle_orm_1.eq)(Bustype_1.busTypes.id, Id))
        .limit(1);
    if (existingBusType.length === 0) {
        throw new BadRequest_1.BadRequest("Bus Type not found");
    }
    await connection_1.db.delete(Bustype_1.busTypes).where((0, drizzle_orm_1.eq)(Bustype_1.busTypes.id, Id));
    return (0, response_1.SuccessResponse)(res, { message: "Bus Type deleted successfully" }, 200);
};
exports.deleteBusType = deleteBusType;
