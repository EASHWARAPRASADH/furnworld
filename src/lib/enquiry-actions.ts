"use server";

import { z } from "zod";
import { updateDb, newId } from "./db";

const schema = z.object({
  name: z.string().trim().min(2, "Please tell us your name"),
  phone: z.string().trim().min(8, "Please add a phone number we can reach"),
  email: z.string().trim().email("Please check the email address").or(z.literal("")),
  message: z.string().trim().max(2000),
  product: z.string().trim().max(200),
  config: z.record(z.string(), z.string()).nullable(),
  website: z.string().max(0).optional(), // honeypot
});

export type EnquiryInput = z.input<typeof schema>;

export async function submitEnquiryAction(input: EnquiryInput): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  try {
    const data = schema.parse(input);
    if (data.website) return { ok: true, id: "ignored" };
    const id = newId("enq");
    await updateDb((db) => {
      db.enquiries.unshift({
        id,
        name: data.name,
        phone: data.phone,
        email: data.email,
        message: data.message,
        product: data.product,
        config: data.config,
        createdAt: new Date().toISOString(),
        status: "new",
      });
    });
    return { ok: true, id };
  } catch (e) {
    if (e instanceof z.ZodError) return { ok: false, error: e.issues[0]?.message ?? "Please check the form" };
    return { ok: false, error: "Could not send right now. Please try WhatsApp." };
  }
}
