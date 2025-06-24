import { createEmbed } from "@features/embeds/mutations/createEmbed";
import { z } from "zod";
import { zfd } from "zod-form-data";

const postSchema = zfd.formData({
  dataFile: zfd.file(),
  thumbnailFileContents: zfd.text(),
  projectId: zfd.numeric(),
  name: zfd.text(),
  onlyTooltipInfo: zfd.checkbox().optional(),
  savedViewIds: z.array(z.coerce.number()).optional(),
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    console.log("Received form data keys:", Array.from(formData.keys()));
    console.log("savedViewIds values:", formData.getAll("savedViewIds"));
    console.log("onlyTooltipInfo value:", formData.get("onlyTooltipInfo"));

    // Normalize savedViewIds to always be an array
    const allSavedViewIds = formData.getAll("savedViewIds");
    formData.delete("savedViewIds");
    allSavedViewIds.forEach((id) => formData.append("savedViewIds", id));

    const data = postSchema.parse(formData);
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
      Array.isArray(data.savedViewIds) ? data.savedViewIds : [],
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
