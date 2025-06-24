import axios from "axios";

export default async function uploadEmbed(
  projectId: number,
  dataFile: File,
  thumbnailFileContents: string,
  name: string,
  onlyTooltipInfo?: boolean,
  savedViewIds?: number[],
) {
  const formData = new FormData();

  formData.append("projectId", projectId.toString());
  formData.append("dataFile", dataFile);
  formData.append("thumbnailFileContents", thumbnailFileContents);
  formData.append("name", name);
  if (onlyTooltipInfo) formData.append("onlyTooltipInfo", "on");

  // Add saved view IDs to form data
  if (savedViewIds && savedViewIds.length > 0) {
    savedViewIds.forEach((id) => {
      formData.append("savedViewIds", id.toString());
    });
  }

  console.log("Uploading embed with data:", {
    projectId,
    name,
    onlyTooltipInfo,
    savedViewIds,
    formDataKeys: Array.from(formData.keys()),
  });

  try {
    const response = await axios.post("/api/embeds", formData);
    console.log("Upload successful:", response.data);
    return response;
  } catch (error) {
    console.error("Upload failed:", error);
    if (axios.isAxiosError(error) && error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    throw error;
  }
}
