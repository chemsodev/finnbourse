import { NextRequest, NextResponse } from "next/server";
import { actorAPI } from "@/app/actions/actorAPI";
import { getServerSession } from "next-auth/next";
import auth from "@/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get session for authentication
    const session = await getServerSession(auth);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const token = (session as any)?.restToken;
    const response = await actorAPI.client.getOne(id, token);

    return NextResponse.json(response);
  } catch (error) {
    console.error(`Error in GET /api/client/${params?.id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch client" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get session for authentication
    const session = await getServerSession(auth);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    console.log(`Client update request for ID ${id}:`, body);

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

    const token = (session as any)?.restToken;
    const response = await actorAPI.client.update(id, body, token);

    return NextResponse.json(response);
  } catch (error) {
    console.error(`Error in POST /api/client/${params?.id}:`, error);
    return NextResponse.json(
      { error: "Failed to update client", details: error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get session for authentication
    const session = await getServerSession(auth);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const token = (session as any)?.restToken;
    await actorAPI.client.delete(id, token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error in DELETE /api/client/${params?.id}:`, error);
    return NextResponse.json(
      { error: "Failed to delete client" },
      { status: 500 }
    );
  }
}
