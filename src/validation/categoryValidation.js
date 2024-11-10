import { z } from "zod";

const addCategoryValidation = z.object({
  categoryCode: z.string().min(2).max(10),
  categoryDesc: z.string().min(2).max(30),
});

const updateCategoryValidation = z.object({
  categoryCode: z.string().min(2).max(10).optional(),
  categoryDesc: z.string().min(2).max(30).optional(),
});

export default {
  addCategoryValidation,
  updateCategoryValidation,
};
