import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Must be a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
