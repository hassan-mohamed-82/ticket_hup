"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import authRouter from "./auth"
// import adminRouter from "./admin"
const roles_1 = __importDefault(require("./roles"));
const admin_1 = __importDefault(require("./admin"));
const category_1 = __importDefault(require("./category"));
const city_1 = __importDefault(require("./city"));
const zone_1 = __importDefault(require("./zone"));
const authenticated_1 = require("../../middlewares/authenticated");
const authorized_1 = require("../../middlewares/authorized");
const auth_1 = __importDefault(require("./auth"));
const router = (0, express_1.Router)();
router.use("/auth", auth_1.default);
router.use(authenticated_1.authenticated, (0, authorized_1.authorizeRoles)("admin", "teacher"));
router.use("/admin", admin_1.default);
router.use("/categories", category_1.default);
router.use("/cities", city_1.default);
router.use("/zones", zone_1.default);
router.use("/roles", roles_1.default);
exports.default = router;
