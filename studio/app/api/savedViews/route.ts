import { SavedView } from "@features/db/entities/savedView";
import { injectRepository } from "@features/db/helpers";
import { z } from "zod";

const postSchema = z.object({
  name: z.string().min(1),
  cameraPosition: z.array(z.number()).length(3),
  cameraTarget: z.array(z.number()).length(3),
  projectId: z.number(),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return new Response("Project ID is required", { status: 400 });
    }

    const savedViewRepository = await injectRepository(SavedView);
    const savedViews = await savedViewRepository.find({
      where: { project: { id: parseInt(projectId) } },
      order: { created_at: "DESC" },
    });

    return Response.json(savedViews);
  } catch (e) {
    console.error("Error fetching saved views:", e);
    return new Response("Internal server error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = postSchema.parse(body);

    const savedViewRepository = await injectRepository(SavedView);
    const savedView = savedViewRepository.create({
      name: data.name,
      cameraPosition: data.cameraPosition,
      cameraTarget: data.cameraTarget,
      project: { id: data.projectId },
    });

    const result = await savedViewRepository.save(savedView);
    return Response.json(result, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return new Response(e.message, { status: 400 });
    }
    console.error("Error creating saved view:", e);
    return new Response("Internal server error", { status: 500 });
  }
}
