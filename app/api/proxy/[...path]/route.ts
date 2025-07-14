import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleProxyRequest(request, params.path);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleProxyRequest(request, params.path);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleProxyRequest(request, params.path);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleProxyRequest(request, params.path);
}

async function handleProxyRequest(request: NextRequest, path: string[]) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_MENU_ORDER || "https://poc.finnetude.com";
    const targetUrl = `${baseUrl}/api/v1/${path.join("/")}`;

    console.log("Proxying request to:", targetUrl);
    console.log("Request method:", request.method);
    console.log(
      "Request headers:",
      Object.fromEntries(request.headers.entries())
    );

    // Get the request body if it exists
    let body: string | undefined;
    if (request.method !== "GET" && request.method !== "HEAD") {
      try {
        body = await request.text();
        console.log("Request body:", body);
      } catch (e) {
        console.error("Error reading request body:", e);
      }
    }

    // Forward headers but exclude problematic ones
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      if (
        ![
          "host",
          "origin",
          "referer",
          "connection",
          "upgrade",
          "sec-fetch-site",
          "sec-fetch-mode",
          "sec-fetch-dest",
        ].includes(key.toLowerCase())
      ) {
        headers.set(key, value);
      }
    });

    // Ensure we have the correct content type for JSON requests
    if (body && !headers.has("content-type")) {
      headers.set("Content-Type", "application/json");
    }

    console.log("Forwarding headers:", Object.fromEntries(headers.entries()));

    // Make the request to the backend
    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      // Don't include credentials in the backend request to avoid CORS issues
    });

    console.log("Backend response status:", response.status);
    console.log(
      "Backend response headers:",
      Object.fromEntries(response.headers.entries())
    );

    // Get response body
    const responseBody = await response.text();
    console.log(
      "Backend response body:",
      responseBody.substring(0, 200) + "..."
    );

    // Create response with CORS headers
    const corsResponse = new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
    });

    // Add comprehensive CORS headers
    corsResponse.headers.set("Access-Control-Allow-Origin", "*");
    corsResponse.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    );
    corsResponse.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With, Accept, Origin"
    );
    corsResponse.headers.set("Access-Control-Allow-Credentials", "true");
    corsResponse.headers.set("Access-Control-Max-Age", "86400");

    // Copy response headers from backend (except CORS headers)
    response.headers.forEach((value, key) => {
      if (
        !key.toLowerCase().startsWith("access-control-") &&
        !["connection", "transfer-encoding", "content-encoding"].includes(
          key.toLowerCase()
        )
      ) {
        corsResponse.headers.set(key, value);
      }
    });

    // Ensure content-type is set
    if (!corsResponse.headers.has("content-type")) {
      corsResponse.headers.set("content-type", "application/json");
    }

    console.log(
      "Sending response with headers:",
      Object.fromEntries(corsResponse.headers.entries())
    );

    return corsResponse;
  } catch (error) {
    console.error("Proxy error:", error);

    const errorResponse = NextResponse.json(
      {
        error: "Proxy request failed",
        message: error instanceof Error ? error.message : "Unknown error",
        details: "Check if the backend server is running and accessible",
        targetUrl: `${
          process.env.NEXT_PUBLIC_MENU_ORDER || "https://poc.finnetude.com"
        }/api/v1/${path.join("/")}`,
      },
      { status: 500 }
    );

    // Add CORS headers to error response too
    errorResponse.headers.set("Access-Control-Allow-Origin", "*");
    errorResponse.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    errorResponse.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    return errorResponse;
  }
}

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  console.log("Handling OPTIONS preflight request");
  console.log(
    "Request headers:",
    Object.fromEntries(request.headers.entries())
  );

  const response = new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-Requested-With, Accept, Origin",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Max-Age": "86400",
    },
  });

  console.log(
    "Sending OPTIONS response with headers:",
    Object.fromEntries(response.headers.entries())
  );

  return response;
}
