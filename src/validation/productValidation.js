import { z } from "zod";

const addProductValidation = z.object({
  productTitle: z.string().min(2).max(100),
  productSummary: z.string().min(2).max(100).optional(),
  productDesc: z.string().optional(),
  productPrice: z.number(),
  productThumbnail: z.string().optional(),
  categoryCode: z.string().min(2).max(10),
});

const updateProductValidation = z.object({
  productTitle: z.string().min(2).max(100).optional(),
  productSummary: z.string().min(2).max(100).optional(),
  productDesc: z.string().optional().optional(),
  productPrice: z.number().optional(),
  productThumbnail: z.string().optional(),
  categoryCode: z.string().min(2).max(10).optional(),
});

export default {
  addProductValidation,
  updateProductValidation,
};
