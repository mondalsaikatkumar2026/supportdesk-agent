import { z } from "zod";

export const ticketIdSchema = z.string().trim().regex(/^TCK-\d{3,}$/, "Ticket ID must look like TCK-001");