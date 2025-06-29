/**
 * Set Login Grace Period API Route
 * Sets a temporary cookie to prevent redirect loops after successful login
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ success: true });

    // Set a temporary cookie that expires in 10 seconds
    // This prevents redirect loops immediately after login
    response.cookies.set("recent_login_grace", "true", {
      maxAge: 10, // 10 seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    console.log("✅ Set login grace period cookie");
    return response;
  } catch (error) {
    console.error("Error setting grace period:", error);
    return NextResponse.json(
      { success: false, error: "Failed to set grace period" },
      { status: 500 }
    );
  }
}
