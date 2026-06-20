import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    return NextResponse.json({
      success: true,
      data: body,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}