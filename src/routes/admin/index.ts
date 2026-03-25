import { Router } from "express";
// import authRouter from "./auth"
// import adminRouter from "./admin"
import rolesRouter from "./roles"

import adminRouter from "./admin"
import cityRouter from "./city"
import zoneRouter from "./zone"
import stationRouter from "./station"
import { authenticated } from "../../middlewares/authenticated";
import { authorizeRoles } from "../../middlewares/authorized";
import authRouter from "./auth"
import { catchAsync } from "../../utils/catchAsync";
const router = Router()

router.use("/auth", authRouter)
router.use(authenticated, authorizeRoles("admin", "teacher"))

router.use("/admin", adminRouter)
router.use("/cities", cityRouter)
router.use("/zones", zoneRouter)
router.use("/stations", stationRouter)
router.use("/roles", rolesRouter)

export default router