export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function apiRequest(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  body?: any,
) {
  const token = localStorage.getItem("token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  console.log("token", token);


  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const responseData = await response.json();

    if (!response.ok) {
      // Extract message from API response if available
      const errorMessage =
        responseData?.message || response.statusText || "An error occurred.";
      throw new Error(errorMessage);
    }

    return responseData;
  } catch (error: any) {
    // Ensure we always return a meaningful error
    throw new Error(error.message || "Network error, please try again.");
  }
}
