import { requireAuth } from "@/server/middleware/require-auth";
import { ticketIdSchema } from "@/server/modules/tickets/ticket.schema";
import { ticketService } from "@/server/modules/tickets/ticket.service";
import { handleError, ok } from "@/server/utils/api-response";

type Context = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Context) {
  try {
    const user = await requireAuth();
    const id = ticketIdSchema.parse((await params).id);
    return ok(await ticketService.runTriage(id, user.id));
  } catch (error) {
    return handleError(error);
  }
}