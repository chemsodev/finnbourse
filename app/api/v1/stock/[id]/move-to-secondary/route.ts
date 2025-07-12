import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    // Get the backend URL from environment variable or use default
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "https://kh.finnetude.com";

    // Forward the request to the actual API with the authorization header
    const response = await fetch(
      `${backendUrl}/api/v1/stock/${id}/move-to-secondary`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Forward the authorization header if it exists
          ...(request.headers.get("authorization") && {
            Authorization: request.headers.get("authorization") || "",
          }),
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      console.error(`API request failed with status: ${response.status}`);
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          error: "Failed to move stock to secondary market",
          details: errorData,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error moving stock to secondary market:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
