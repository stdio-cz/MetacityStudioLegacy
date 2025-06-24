import { canEditProject } from "@features/auth/acl";
import { Embed } from "@features/db/entities/embed";
import { SavedView } from "@features/db/entities/savedView";
import { injectRepository } from "@features/db/helpers";
import { toPlain } from "@features/helpers/objects";
import { ensureBucket, getEmbedBucketName, saveFileStream } from "@features/storage";
import { randomUUID } from "crypto";
import { Readable } from "stream";
import { ReadableStream } from "stream/web";
import { In } from "typeorm";

export async function createEmbed(
  projectId: number,
  name: string,
  file: File,
  thumbnailFileContents: string,
  onlyTooltipInfo: boolean = false,
  savedViewIds: number[] = [],
) {
  if (!(await canEditProject())) throw new Error("Unauthorized");

  const embedRepository = await injectRepository(Embed);
  const savedViewRepository = await injectRepository(SavedView);

  const versionFileName = randomUUID();
  const bucketName = getEmbedBucketName(versionFileName);

  // Get saved views if IDs are provided
  let savedViews: SavedView[] = [];
  if (savedViewIds.length > 0) {
    savedViews = await savedViewRepository.find({
      where: { id: In(savedViewIds) },
    });
  }

  // create the embed in the database (without saved views for now)
  const embed = embedRepository.create({
    project: { id: projectId },
    name: name,
    thumbnailContents: thumbnailFileContents,
    bucketName: bucketName,
    onlyTooltipInfo: onlyTooltipInfo,
  });

  // Save the embed
  const savedEmbed = await embedRepository.save(embed);

  // Use the relation API to set the many-to-many relationship
  if (savedViews.length > 0) {
    await embedRepository
      .createQueryBuilder()
      .relation(Embed, "savedViews")
      .of(savedEmbed)
      .add(savedViews.map((v) => v.id));
  }

  // save the files to the bucket
  try {
    await ensureBucket(embed.bucketName);
    const fileStream = Readable.fromWeb(file.stream() as ReadableStream);
    await saveFileStream(file.name, embed.bucketName, fileStream);
  } catch (e) {
    await embedRepository.remove(savedEmbed);
    throw e;
  }

  // return the embed with saved views
  const finalEmbed = await embedRepository.findOne({
    where: { id: savedEmbed.id },
    relations: ["savedViews"],
  });
  return toPlain(finalEmbed);
}
