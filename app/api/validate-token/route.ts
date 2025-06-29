/**
 * Token Validation API Route
 * Validates tokens against the backend and returns validation status
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { valid: false, error: "No token provided" },
        { status: 400 }
      );
    }

    // Validate token with backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      return NextResponse.json(
        { valid: false, error: "Backend URL not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(`${backendUrl}/auth/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ token }),
    });

    if (response.ok) {
      const result = await response.json();
      return NextResponse.json({ valid: true, data: result });
    } else {
      // Token is invalid according to backend
      const errorText = await response.text();
      return NextResponse.json(
        {
          valid: false,
          error: `Backend validation failed: ${response.status}`,
          details: errorText,
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error validating token:", error);
    return NextResponse.json(
      {
        valid: false,
        error: "Token validation failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
