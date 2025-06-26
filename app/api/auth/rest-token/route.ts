import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import auth from "@/auth";

interface SessionUser {
  token?: string;
  restToken?: string;
  loginSource?: "REST" | "GraphQL";
  email?: string;
  id?: string;
}

export async function GET(request: NextRequest) {
  try {
    // Get the current session
    const session = (await getServerSession(auth)) as any;

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = session.user as SessionUser;

    // If REST token is already in session, return it
    if (user.restToken) {
      return NextResponse.json({
        restToken: user.restToken,
        source: "session",
      });
    }

    // If no REST token in session, try to fetch from login API
    if (user.token || user.email) {
      try {
        const loginResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              // You might need to handle password differently here
              // This is a simplified approach - consider storing encrypted credentials
              token: user.token, // Use existing token if available
            }),
          }
        );

        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          if (loginData.token) {
            // Update session with REST token (this would require session update)
            return NextResponse.json({
              restToken: loginData.token,
              source: "api_fetch",
            });
          }
        }
      } catch (fetchError) {
        console.error("Failed to fetch REST token from API:", fetchError);
      }
    }

    return NextResponse.json(
      { error: "REST token not available" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error in REST token endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
