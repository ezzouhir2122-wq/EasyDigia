import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  // dialing chars only: phone is interpolated raw into the notification email HTML and the admin CSV export
  phone: z.string().max(30).regex(/^[0-9+()\s-]*$/).optional(),
  service: z.string().optional(),
  message: z.string().min(1),
  quoteRequested: z.boolean().default(false),
  locale: z.enum(["fr", "en", "ar"]),
});

export type LeadInput = z.infer<typeof leadSchema>;

// Formation leads: tagged "Formation …" by /api/formation, or a contact form where the visitor typed "formation" as service
export const isFormationLead = (service?: string | null) => /formation/i.test(service ?? "");
