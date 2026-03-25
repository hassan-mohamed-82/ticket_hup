"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const station_1 = require("../../controllers/admin/station");
const catchAsync_1 = require("../../utils/catchAsync");
const router = (0, express_1.Router)();
// ✅ Create Station
router.post("/", (0, catchAsync_1.catchAsync)(station_1.createStation));
// ✅ Get All Stations
router.get("/", (0, catchAsync_1.catchAsync)(station_1.getStations));
// ✅ Get Station By ID
router.get("/:id", (0, catchAsync_1.catchAsync)(station_1.getStationById));
// ✅ Update Station
router.put("/:id", (0, catchAsync_1.catchAsync)(station_1.updateStation));
// ✅ Delete Station
router.delete("/:id", (0, catchAsync_1.catchAsync)(station_1.deleteStation));
exports.default = router;
