import { NextResponse } from "next/server";

export async function POST() {
  const targetSegmentIndex = Math.floor(Math.random() * 8);
  return NextResponse.json({ targetSegmentIndex });
}
