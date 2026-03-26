import { z } from "zod";

export const loginSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .min(9, "Phone number must be at least 9 digits")
    // Regex to allow +855 or 0... formats
    .regex(/^[0-9+]+$/, "Invalid phone number format"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;