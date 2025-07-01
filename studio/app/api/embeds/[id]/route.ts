import { Embed } from "@features/db/entities/embed";
import { injectRepository } from "@features/db/helpers";
import { deleteEmbed } from "@features/embeds/mutations/deleteEmbed";
import { NextRequest } from "next/server";
import { z } from "zod";

const patchSchema = z.object({
  name: z.string(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const body = await req.json();
    const { name } = patchSchema.parse(body);
    const embedRepository = await injectRepository(Embed);
    const embed = await embedRepository.findOne({ where: { id } });
    if (!embed) {
      return new Response(JSON.stringify({ error: "Embed not found" }), { status: 404 });
    }
    embed.name = name;
    await embedRepository.save(embed);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: "Validation failed", details: e.errors }), { status: 400 });
    }
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    await deleteEmbed(id);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
