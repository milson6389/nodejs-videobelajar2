import { z } from "zod";

const registerUserValidation = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email().min(2).max(100),
  noHp: z.string().min(2).max(20),
  password: z.string().min(2).max(100),
  profilePicture: z.string().optional(),
});

const loginUserValidation = z.object({
  email: z.string().email().min(2).max(100),
  password: z.string().min(2).max(100),
});

const updateUserValidation = z.object({
  fullName: z.string().min(2).max(100).optional(),
  noHp: z.string().min(2).max(20).optional(),
  password: z.string().min(2).max(100).optional(),
  profilePicture: z.string().optional(),
});

export default {
  registerUserValidation,
  loginUserValidation,
  updateUserValidation,
};
