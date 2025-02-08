// Fetch metadata from social media link
export async function fetchSocialMediaPreview(contentLink: string) {
  const API_KEY = "16e70d7885543f78a43502baa8e2e7e2";

  if (!contentLink)
    return {
      title: "No content available",
      imageUrl: "",
      description: "",
    };

  try {
    const response = await fetch(
      `https://api.linkpreview.net?key=${API_KEY}&q=${contentLink}`,
    );
    console.log("response", response);

    const data = await response.json();
    return {
      title: data.title || "No title available",
      imageUrl: data.image || "",
      description: data.description
      ? data.description.length > 100
        ? data.description.slice(0, 100) + "..."
        : data.description
      : "No description available",    };
  } catch (error) {
    console.error("Error fetching social media preview:", error);
    return {
      title: "No title available",
      imageUrl: "",
      description: "No description available",
    };
  }
}
