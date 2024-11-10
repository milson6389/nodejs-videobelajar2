import { z } from "zod";

const registerTutorValidation = z.object({
  tutorTitle: z.string().min(2).max(150),
  tutorDesc: z.string().optional(),
});

const updateTutorValidation = z.object({
  tutorTitle: z.string().min(2).max(150).optional(),
  tutorDesc: z.string().optional(),
});

export default {
  registerTutorValidation,
  updateTutorValidation,
};
