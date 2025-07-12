import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get the backend URL from environment variable or use default
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "https://kh.finnetude.com";

    // Forward the request to the actual API with the authorization header
    const response = await fetch(`${backendUrl}/api/v1/agence`, {
      headers: {
        "Content-Type": "application/json",
        // Forward the authorization header if it exists
        ...(request.headers.get("authorization") && {
          Authorization: request.headers.get("authorization") || "",
        }),
      },
    });

    if (!response.ok) {
      console.error(`API request failed with status: ${response.status}`);
      return NextResponse.json(
        { error: `API request failed with status: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching Agence data:", error);
    return NextResponse.json(
      { error: `Failed to fetch Agence data: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get the backend URL from environment variable or use default
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "https://kh.finnetude.com";

    // Forward the request to the actual API with the authorization header
    const response = await fetch(`${backendUrl}/api/v1/agence`, {
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
      const errorText = await response.text();
      console.error(
        `API request failed with status: ${response.status}`,
        errorText
      );
      return NextResponse.json(
        {
          error: `API request failed with status: ${response.status}`,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error creating Agence:", error);
    return NextResponse.json(
      { error: `Failed to create Agence: ${error.message}` },
      { status: 500 }
    );
  }
}
