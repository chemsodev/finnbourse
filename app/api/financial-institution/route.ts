import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Forward the request to the actual API with the authorization header
    const response = await fetch(
      "https://kh.finnetude.com/api/v1/financial-institution",
      {
        headers: {
          "Content-Type": "application/json",
          // Forward the authorization header if it exists
          ...(request.headers.get("authorization") && {
            Authorization: request.headers.get("authorization") || "",
          }),
        },
      }
    );

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
    console.error("Error fetching Financial Institution data:", error);
    return NextResponse.json(
      { error: `Failed to fetch Financial Institution data: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward the request to the actual API with the authorization header
    const response = await fetch(
      "https://kh.finnetude.com/api/v1/financial-institution",
      {
        method: "POST",
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
      return NextResponse.json(
        { error: `API request failed with status: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error creating Financial Institution:", error);
    return NextResponse.json(
      { error: `Failed to create Financial Institution: ${error.message}` },
      { status: 500 }
    );
  }
}
