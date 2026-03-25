import { Router } from "express";
import { createStation, updateStation, getStationById, getStations, deleteStation } from "../../controllers/admin/station";
import { catchAsync } from "../../utils/catchAsync";

const router = Router();

// ✅ Create Station
router.post("/", catchAsync(createStation));
// ✅ Get All Stations
router.get("/", catchAsync(getStations));
// ✅ Get Station By ID
router.get("/:id", catchAsync(getStationById));
// ✅ Update Station
router.put("/:id", catchAsync(updateStation));
// ✅ Delete Station
router.delete("/:id", catchAsync(deleteStation));

export default router;
