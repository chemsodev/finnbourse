import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Get the backend URL from environment variable or use default
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "https://kh.finnetude.com";

    // Forward the request to the actual API with the authorization header
    const response = await fetch(`${backendUrl}/api/v1/client/${id}`, {
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
    console.error("Error fetching Client data:", error);
    return NextResponse.json(
      { error: `Failed to fetch Client data: ${error.message}` },
      { status: 500 }
    );
  }
}

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
    const response = await fetch(`${backendUrl}/api/v1/client/${id}`, {
      method: "PUT",
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
    console.error("Error updating Client:", error);
    return NextResponse.json(
      { error: `Failed to update Client: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Get the backend URL from environment variable or use default
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "https://kh.finnetude.com";

    // Forward the request to the actual API with the authorization header
    const response = await fetch(`${backendUrl}/api/v1/client/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // Forward the authorization header if it exists
        ...(request.headers.get("authorization") && {
          Authorization: request.headers.get("authorization") || "",
        }),
      },
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

    // DELETE might return no content
    if (response.status === 204) {
      return NextResponse.json({ success: true });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error deleting Client:", error);
    return NextResponse.json(
      { error: `Failed to delete Client: ${error.message}` },
      { status: 500 }
    );
  }
}
