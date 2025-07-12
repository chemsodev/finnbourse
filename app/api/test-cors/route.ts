import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Test the API connection through our proxy
    const baseUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "https://kh.finnetude.com";
    const BACKEND_URL = `${baseUrl}/api/v1`;
    const response = await fetch(`${BACKEND_URL}/iob`, {
      headers: {
        "Content-Type": "application/json",
      },
      // Include any auth token from the request headers
      ...(request.headers.get("authorization") && {
        headers: {
          Authorization: request.headers.get("authorization") || "",
        },
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `API request failed with status: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error testing API connection:", error);
    return NextResponse.json(
      { error: `Failed to connect to API: ${error.message}` },
      { status: 500 }
    );
  }
}
