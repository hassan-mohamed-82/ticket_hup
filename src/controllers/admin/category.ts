import { Request, Response } from "express";
import { eq, sql } from "drizzle-orm";
import { db } from "../../models/connection";
import { category } from "../../models/schema";
import { BadRequest } from "../../Errors/BadRequest";
import { SuccessResponse } from "../../utils/response";
import {
  deleteImage,
  handleImageUpdate,
  validateAndSaveLogo,
} from "../../utils/handleImages";

export const createCategory = async (req: Request, res: Response) => {
  const { name, description, image, parentCategoryId } = req.body;

  if (!name) {
    throw new BadRequest("Name is required");
  }

  if (parentCategoryId) {
    const existingParent = await db
      .select({ id: category.id })
      .from(category)
      .where(eq(category.id, parentCategoryId))
      .limit(1);

    if (existingParent.length === 0) {
      throw new BadRequest("Parent category not found");
    }
  }

  const existingCategory = await db
    .select({ id: category.id })
    .from(category)
    .where(eq(category.name, name))
    .limit(1);

  if (existingCategory.length > 0) {
    throw new BadRequest("Category already exists");
  }

  let imageUrl: string | null = null;
  if (image) {
    imageUrl = await validateAndSaveLogo(req, image, "category");
  }

  await db.insert(category).values({
    name,
    description,
    image: imageUrl,
    parentCategoryId,
  });

  return SuccessResponse(res, { message: "Category created successfully" }, 201);
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, image, parentCategoryId } = req.body;

  const existingCategory = await db
    .select()
    .from(category)
    .where(eq(category.id, id))
    .limit(1);

  if (existingCategory.length === 0) {
    throw new BadRequest("Category not found");
  }

  if (parentCategoryId) {
    if (parentCategoryId === id) {
      throw new BadRequest("Category cannot be its own parent");
    }

    const existingParent = await db
      .select({ id: category.id })
      .from(category)
      .where(eq(category.id, parentCategoryId))
      .limit(1);

    if (existingParent.length === 0) {
      throw new BadRequest("Parent category not found");
    }
  }

  const imageUrl = await handleImageUpdate(
    req,
    existingCategory[0].image,
    image,
    "category"
  );

  await db
    .update(category)
    .set({
      name: name ?? existingCategory[0].name,
      description: description ?? existingCategory[0].description,
      image: imageUrl ?? existingCategory[0].image,
      parentCategoryId: parentCategoryId ?? existingCategory[0].parentCategoryId,
    })
    .where(eq(category.id, id));

  return SuccessResponse(res, { message: "Category updated successfully" }, 200);
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  const existingCategory = await db
    .select()
    .from(category)
    .where(eq(category.id, id))
    .limit(1);

  if (existingCategory.length === 0) {
    throw new BadRequest("Category not found");
  }

  await db.delete(category).where(eq(category.id, id));

  if (existingCategory[0].image) {
    await deleteImage(existingCategory[0].image);
  }

  return SuccessResponse(res, { message: "Category deleted successfully" }, 200);
};

export const getAllCategory = async (req: Request, res: Response) => {
  const categories = await db.select().from(category);

  const categoryMap = new Map(categories.map((cat) => [cat.id, cat]));
  const parentIds = new Set(
    categories
      .filter((cat) => Boolean(cat.parentCategoryId))
      .map((cat) => cat.parentCategoryId as string)
  );

  const data = categories.map((cat) => {
    const ancestors: Array<{ id: string; name: string; level: number }> = [];
    let current = cat;
    let level = 1;

    while (current.parentCategoryId) {
      const parent = categoryMap.get(current.parentCategoryId);
      if (!parent) break;

      ancestors.push({ id: parent.id, name: parent.name, level });
      current = parent;
      level += 1;
    }

    const isLeaf = !parentIds.has(cat.id);

    return {
      ...cat,
      ancestors,
      isLeaf,
    };
  });

  return SuccessResponse(
    res,
    { message: "Categories fetched successfully", data },
    200
  );
};

export const getCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const categories = await db.select().from(category);
  const existingCategory = categories.find((item) => item.id === id);

  if (!existingCategory) {
    throw new BadRequest("Category not found");
  }

  const categoryMap = new Map(categories.map((cat) => [cat.id, cat]));

  const ancestors: Array<{ id: string; name: string; level: number }> = [];
  let current = existingCategory;
  let level = 1;

  while (current.parentCategoryId) {
    const parent = categoryMap.get(current.parentCategoryId);
    if (!parent) break;

    ancestors.push({ id: parent.id, name: parent.name, level });
    current = parent;
    level += 1;
  }

  const data = {
    ...existingCategory,
    ancestors,
  };

  return SuccessResponse(
    res,
    { message: "Category fetched successfully", data },
    200
  );
};

export const getCategoryLineage = async (req: Request, res: Response) => {
  const { id } = req.params;

  const existingCategory = await db
    .select({ id: category.id })
    .from(category)
    .where(eq(category.id, id))
    .limit(1);

  if (existingCategory.length === 0) {
    throw new BadRequest("Category not found");
  }

  const query = sql`
    WITH RECURSIVE category_path AS (
      SELECT id, name, description, image, parent_category_id, created_at, updated_at, 0 as level
      FROM category
      WHERE id = ${id}
      UNION ALL
      SELECT c.id, c.name, c.description, c.image, c.parent_category_id, c.created_at, c.updated_at, cp.level + 1
      FROM category c
      JOIN category_path cp ON c.id = cp.parent_category_id
    )
    SELECT * FROM category_path ORDER BY level;
  `;

  const lineage = await db.execute(query);

  return SuccessResponse(
    res,
    { message: "Category lineage fetched successfully", data: lineage[0] },
    200
  );
};
