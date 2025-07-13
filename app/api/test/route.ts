import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  console.log("Test endpoint called");

  const response = NextResponse.json({
    message: "Proxy test endpoint working",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    backendUrl:
      process.env.NEXT_PUBLIC_MENU_ORDER || "https://poc.finnetude.com",
  });

  // Add CORS headers
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return response;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
