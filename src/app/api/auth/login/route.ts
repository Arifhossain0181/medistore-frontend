import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000";

  try {
    const body = (await req.json()) as { email?: string; password?: string };

    if (!body?.email || !body?.password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    backendUrl = backendUrl.replace(/\/$/, "");

    const upstream = await fetch(`${backendUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const raw = await upstream.text();
    let payload: unknown = null;

    if (raw) {
      try {
        payload = JSON.parse(raw);
      } catch {
        payload = { message: raw };
      }
    }

    const response = NextResponse.json(payload, { status: upstream.status });

    const setCookie = upstream.headers.get("set-cookie");
    if (setCookie) {
      response.headers.set("set-cookie", setCookie);
    }

    return response;
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        message: `Login service unavailable: cannot reach backend (${backendUrl}/api/auth/login). ${reason}`,
      },
      { status: 503 }
    );
  }
}
