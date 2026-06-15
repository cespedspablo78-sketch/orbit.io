import { NextRequest, NextResponse } from "next/server";
import pinataSDK from "@pinata/sdk";
import { Readable } from "stream";

/**
 * POST /api/upload — pins an image to IPFS via Pinata.
 * Accepts multipart form-data with a `file` field.
 * Returns: { ipfsUrl, cid }
 *
 * Requires PINATA_API_KEY and PINATA_SECRET_KEY (set in .env.local locally
 * and in Vercel → Project → Settings → Environment Variables).
 */

export const runtime = "nodejs";

const API_KEY = process.env.PINATA_API_KEY;
const SECRET_KEY = process.env.PINATA_SECRET_KEY;
const GATEWAY = "https://gateway.pinata.cloud/ipfs/";
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  try {
    if (!API_KEY || !SECRET_KEY) {
      return NextResponse.json(
        { error: "Image hosting is not configured yet (missing Pinata keys)." },
        { status: 503 },
      );
    }

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Image is too large (max 5 MB)." }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = Readable.from(buffer);
    // pinata's SDK reads `.path` off the stream to name the multipart part
    (stream as unknown as { path: string }).path = file.name || "vynx-token-image";

    const pinata = new pinataSDK(API_KEY, SECRET_KEY);
    const result = await pinata.pinFileToIPFS(stream, {
      pinataMetadata: { name: file.name || "vynx-token-image" },
      pinataOptions: { cidVersion: 1 },
    });

    return NextResponse.json({ ipfsUrl: `${GATEWAY}${result.IpfsHash}`, cid: result.IpfsHash });
  } catch (err) {
    console.error("pinata upload error:", err);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
