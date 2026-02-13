import nodemailer from "nodemailer";

// In development, use a test account (logs to console)
// In production, configure with real SMTP credentials via env vars
let transporter: nodemailer.Transporter;

async function getTransporter() {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST) {
    // Production: use configured SMTP
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Development: use Ethereal test account
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  return transporter;
}

export async function sendContactNotification(
  name: string,
  email: string,
  message: string
): Promise<void> {
  try {
    const transport = await getTransporter();
    const contactEmail = process.env.CONTACT_EMAIL || "admin@rastacollections.com";

    const info = await transport.sendMail({
      from: `"Rasta Collections Website" <noreply@rastacollections.com>`,
      to: contactEmail,
      subject: `New Contact Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <hr>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    // In development, log the preview URL
    if (!process.env.SMTP_HOST) {
      console.log("Email preview URL:", nodemailer.getTestMessageUrl(info));
    }
  } catch (err) {
    console.error("Failed to send contact notification email:", err);
    // Don't throw — email failure shouldn't prevent the message from being saved
  }
}
