import { NextResponse } from "next/server";

export async function GET() {
  const apiUrl = process.env.EXTRACOM_API_URL;
  const shop = process.env.EXTRACOM_SHOP;
  const hasSecret = !!process.env.EXTRACOM_SESSION_SECRET;

  const debug: Record<string, unknown> = {
    apiUrl,
    shop,
    hasSecret,
  };

  try {
    if (apiUrl && shop) {
      const url = `${apiUrl}/v2/s/${shop}/storefront/catalogs`;
      const response = await fetch(url, { cache: "no-store" });
      const text = await response.text();

      debug.catalogsStatus = response.status;
      debug.catalogsBodySnippet = text.slice(0, 200);
    } else {
      debug.catalogsError = "Missing EXTRACOM_API_URL or EXTRACOM_SHOP";
    }
  } catch (error) {
    debug.catalogsError = (error as Error).message ?? "Unknown error";
  }

  return NextResponse.json(debug);
}
