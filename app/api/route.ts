"use server";

import { google } from "googleapis";
import { NextResponse } from "next/server";

if (process.env.NODE_ENV !== "production") {
  await import("dotenv").then(mod => mod.config());
}

const client_email = process.env.CLIENT_EMAIL;
const private_key = process.env.PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!client_email || !private_key) {
  throw new Error("Missing CLIENT_EMAIL or PRIVATE_KEY in environment variables");
}

export async function GET() {
  try {
    // สร้าง Google Sheets API client
    const client = new google.auth.JWT({
      email: client_email,
      key: private_key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    await client.authorize();

    const sheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "1wZSXzz-pXXjlyU6Nx3LCcACBYG-53p3VFGPQBUh4_bg";

    const spreadsheetInfo = await sheets.spreadsheets.get({
      spreadsheetId,
      includeGridData: false,
    });

    const sheetNames = spreadsheetInfo.data.sheets?.map(
      (sheet) => sheet.properties?.title
    );

    return NextResponse.json(sheetNames, { status: 200 });

  } catch (err) {
    console.error("Sheets API Error:", err);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
