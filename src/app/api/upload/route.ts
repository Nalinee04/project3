//upload
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as Blob | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${Date.now()}.png`;
  const filePath = path.join(process.cwd(), "public/images", fileName);

  fs.writeFileSync(filePath, buffer);

  return NextResponse.json({ path: `/images/${fileName}` });
}
