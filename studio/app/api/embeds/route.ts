import { createEmbed } from "@features/embeds/mutations/createEmbed";
import { z } from "zod";

const postSchema = z.object({
  dataFile: z.instanceof(File),
  thumbnailFileContents: z.string(),
  projectId: z.number(),
  name: z.string(),
  onlyTooltipInfo: z.boolean().optional(),
  savedViewIds: z.array(z.number()).optional(),
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    console.log("Received form data keys:", Array.from(formData.keys()));
    console.log("savedViewIds values:", formData.getAll("savedViewIds"));
    console.log("onlyTooltipInfo value:", formData.get("onlyTooltipInfo"));

    // Manually parse form data to handle savedViewIds correctly
    const dataFile = formData.get("dataFile") as File;
    const thumbnailFileContents = formData.get("thumbnailFileContents") as string;
    const projectId = parseInt(formData.get("projectId") as string);
    const name = formData.get("name") as string;
    const onlyTooltipInfo = formData.get("onlyTooltipInfo") === "on";

    // Handle savedViewIds - convert to array of numbers
    const savedViewIdsRaw = formData.getAll("savedViewIds");
    const savedViewIds = savedViewIdsRaw.length > 0 ? savedViewIdsRaw.map((id) => parseInt(id as string)) : undefined;

    const data = postSchema.parse({
      dataFile,
      thumbnailFileContents,
      projectId,
      name,
      onlyTooltipInfo,
      savedViewIds,
    });

    console.log("Parsed data:", {
      projectId: data.projectId,
      name: data.name,
      onlyTooltipInfo: data.onlyTooltipInfo,
      savedViewIds: data.savedViewIds,
    });

    const model = await createEmbed(
      data.projectId,
      data.name,
      data.dataFile,
      data.thumbnailFileContents,
      data.onlyTooltipInfo ?? false,
      data.savedViewIds ?? [],
    );

    return Response.json(model, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      console.error("Validation error:", e.errors);
      return new Response(JSON.stringify({ error: "Validation failed", details: e.errors }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    console.error("Other error:", e);
    return new Response(
      JSON.stringify({ error: "Internal server error", message: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
