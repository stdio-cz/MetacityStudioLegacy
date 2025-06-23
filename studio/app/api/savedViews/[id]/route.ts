import { SavedView } from "@features/db/entities/savedView";
import { injectRepository } from "@features/db/helpers";
import { z } from "zod";

const putSchema = z.object({
  name: z.string().min(1).optional(),
  cameraPosition: z.array(z.number()).length(3).optional(),
  cameraTarget: z.array(z.number()).length(3).optional(),
});

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const savedViewRepository = await injectRepository(SavedView);
    const savedView = await savedViewRepository.findOne({
      where: { id: parseInt(params.id) },
    });

    if (!savedView) {
      return new Response("Saved view not found", { status: 404 });
    }

    return Response.json(savedView);
  } catch (e) {
    console.error("Error fetching saved view:", e);
    return new Response("Internal server error", { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const data = putSchema.parse(body);

    const savedViewRepository = await injectRepository(SavedView);
    const savedView = await savedViewRepository.findOne({
      where: { id: parseInt(params.id) },
    });

    if (!savedView) {
      return new Response("Saved view not found", { status: 404 });
    }

    Object.assign(savedView, data);
    const result = await savedViewRepository.save(savedView);

    return Response.json(result);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return new Response(e.message, { status: 400 });
    }
    console.error("Error updating saved view:", e);
    return new Response("Internal server error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const savedViewRepository = await injectRepository(SavedView);
    const savedView = await savedViewRepository.findOne({
      where: { id: parseInt(params.id) },
    });

    if (!savedView) {
      return new Response("Saved view not found", { status: 404 });
    }

    await savedViewRepository.remove(savedView);
    return new Response(null, { status: 204 });
  } catch (e) {
    console.error("Error deleting saved view:", e);
    return new Response("Internal server error", { status: 500 });
  }
}
