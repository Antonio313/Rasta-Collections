import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { contactFormSchema } from "@rasta/shared";
import { sendContactNotification } from "../services/email.service";

export async function submitContactForm(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = contactFormSchema.parse(req.body);

    // Save to database
    await prisma.contactMessage.create({ data });

    // Send email notification (non-blocking — failure won't affect response)
    sendContactNotification(data.name, data.email, data.message);

    res.status(201).json({ message: "Message sent successfully" });
  } catch (err) {
    next(err);
  }
}
