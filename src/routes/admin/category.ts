import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getCategoryById,
  getCategoryLineage,
  updateCategory,
} from "../../controllers/admin/category";
import { catchAsync } from "../../utils/catchAsync";

const router = Router();

router.post("/", catchAsync(createCategory));
router.get("/", catchAsync(getAllCategory));
router.get("/lineage/:id", catchAsync(getCategoryLineage));
router.get("/:id", catchAsync(getCategoryById));
router.put("/:id", catchAsync(updateCategory));
router.delete("/:id", catchAsync(deleteCategory));

export default router;
