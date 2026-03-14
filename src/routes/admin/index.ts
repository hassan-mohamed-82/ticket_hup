import { Router } from "express";
// import authRouter from "./auth"
// import adminRouter from "./admin"
import rolesRouter from "./roles"

import adminRouter from "./admin"
import categoryRouter from "./category"
import cityRouter from "./city"
import zoneRouter from "./zone"
import { authenticated } from "../../middlewares/authenticated";
import { authorizeRoles } from "../../middlewares/authorized";
import authRouter from "./auth"
import { catchAsync } from "../../utils/catchAsync";
const router = Router()

router.use("/auth", authRouter)
router.use(authenticated, authorizeRoles("admin", "teacher"))

router.use("/admin", adminRouter)
router.use("/categories", categoryRouter)
router.use("/cities", cityRouter)
router.use("/zones", zoneRouter)
router.use("/roles", rolesRouter)

export default router