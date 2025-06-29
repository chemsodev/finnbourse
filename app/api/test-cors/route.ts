import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Test the API connection through our proxy
    const response = await fetch("https://kh.finnetude.com/api/v1/iob", {
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
