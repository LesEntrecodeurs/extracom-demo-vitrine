import { NextResponse } from "next/server";
import { promises as fs } from "fs";

export async function GET() {
  let gateway: string | null = null;

  try {
    const routeContent = await fs.readFile("/proc/net/route", "utf8");
    const lines = routeContent.split(/\r?\n/);

    // Skip header line, find line where Destination is 00000000 (default route)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const cols = line.split(/\s+/);
      if (cols.length < 3) continue;

      const destination = cols[1];
      const gwHex = cols[2];

      if (destination === "00000000" && gwHex && gwHex.length === 8) {
        // Gateway is in hex little-endian, convert to normal dotted IP
        const bytes = [
          gwHex.slice(0, 2),
          gwHex.slice(2, 4),
          gwHex.slice(4, 6),
          gwHex.slice(6, 8),
        ];
        const reversed = bytes.reverse();
        const decimal = reversed.map((b) => parseInt(b, 16));
        gateway = decimal.join(".");
        break;
      }
    }
  } catch (error) {
    // If reading /proc/net/route fails, gateway will stay null
    gateway = null;
  }

  if (!gateway) {
    return NextResponse.json({
      gateway: null,
      status: null,
      bodySnippet: null,
    });
  }

  try {
    const url = `http://${gateway}:3001/v2/s/BIJOU/storefront/catalogs`;
    const response = await fetch(url, { cache: "no-store" });
    const text = await response.text();

    return NextResponse.json({
      gateway,
      status: response.status,
      bodySnippet: text.slice(0, 200),
    });
  } catch (error) {
    return NextResponse.json({
      gateway,
      status: null,
      bodySnippet: (error as Error).message ?? "Unknown error",
    });
  }
}
