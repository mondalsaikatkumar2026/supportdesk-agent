import { requireAuth } from "@/server/middleware/require-auth";
import { ticketService } from "@/server/modules/tickets/ticket.service";
import { handleError, ok } from "@/server/utils/api-response";

export async function GET() {
  try {
    await requireAuth();
    return ok({ tickets: await ticketService.list() });
  } catch (error) {
    return handleError(error);
  }
}