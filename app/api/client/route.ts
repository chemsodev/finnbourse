import { NextRequest, NextResponse } from "next/server";
import { actorAPI } from "@/app/actions/actorAPI";
import { clientFetchREST } from "@/app/actions/fetchREST";
import { getServerSession } from "next-auth/next";
import auth from "@/auth";

export async function GET(req: NextRequest) {
  try {
    // Get session for authentication
    const session = await getServerSession(auth);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = (session as any)?.restToken;
    const response = await actorAPI.client.getAll(token);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in GET /api/client:", error);
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Get session for authentication
    const session = await getServerSession(auth);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("Client creation request body:", body);

    // Ensure address field is included
    if (!body.address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    // Make sure we have the wilaya field as well
    if (!body.wilaya) {
      return NextResponse.json(
        { error: "Wilaya is required" },
        { status: 400 }
      );
    }

    // For client details, make sure address is included
    if (body.client_details) {
      body.client_details.address = body.address;
      body.client_details.wilaya = body.wilaya;
    }

    // Map frontend data to API format
    const token = (session as any)?.restToken;

    // Use the correct endpoint for client creation
    const response = await clientFetchREST("/agence/clients", {
      method: "POST",
      body,
      token,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in POST /api/client:", error);
    return NextResponse.json(
      { error: "Failed to create client", details: error },
      { status: 500 }
    );
  }
}
