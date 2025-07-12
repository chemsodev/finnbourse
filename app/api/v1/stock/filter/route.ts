import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get backend URL from environment
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "https://kh.finnetude.com";

    // Forward the request to the actual backend API
    const response = await fetch(`${backendUrl}/api/v1/stock/filter`, {
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
      console.error(
        `Backend API request failed with status: ${response.status}`
      );
      return NextResponse.json(
        { error: `Backend API request failed with status: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in stock filter API:", error);
    return NextResponse.json(
      { error: `Failed to filter stocks: ${error.message}` },
      { status: 500 }
    );
  }
}
