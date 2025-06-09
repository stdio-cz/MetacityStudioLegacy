import axios from "axios";

export default async function uploadEmbed(
  projectId: number,
  dataFile: File,
  thumbnailFileContents: string,
  name: string,
  onlyTooltipInfo?: boolean,
) {
  const formData = new FormData();

  formData.append("projectId", projectId.toString());
  formData.append("dataFile", dataFile);
  formData.append("thumbnailFileContents", thumbnailFileContents);
  formData.append("name", name);
  if (onlyTooltipInfo) formData.append("onlyTooltipInfo", "on");

  const response = await axios.post("/api/embeds", formData);

  return response;
}
