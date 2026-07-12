import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(1),
  locale: z.enum(["fr", "en", "ar"]),
});

export type LeadInput = z.infer<typeof leadSchema>;
