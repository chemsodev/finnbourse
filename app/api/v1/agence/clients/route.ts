import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get the backend URL from environment variable or use default
    const baseUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "https://kh.finnetude.com";

    // Forward the request to the agence/clients endpoint for client creation
    const response = await fetch(`${baseUrl}/api/v1/agence/clients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Forward the authorization header if it exists
        ...(request.headers.get("authorization") && {
          Authorization: request.headers.get("authorization") || "",
        }),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error(`API request failed with status: ${response.status}`);
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: "Failed to create client", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
