"use server";

import { google } from "googleapis";
import { NextResponse } from "next/server";

// โหลด dotenv ใน dev เท่านั้น
if (process.env.NODE_ENV !== "production") {
  await import("dotenv").then(mod => mod.config());
}

// ตรวจสอบตัวแปร ENV ทันทีตอนโหลด
const client_email = process.env.CLIENT_EMAIL;
const private_key = process.env.PRIVATE_KEY;

if (!client_email || !private_key) {
  throw new Error("Missing CLIENT_EMAIL or PRIVATE_KEY in environment variables");
}

export async function POST(request: Request) {
    // รับ subject จาก form data
    const form = await request.formData();
    const subject = form.get("subject");
    
    if (!subject || typeof subject !== "string") {
        return NextResponse.json({ error: "Invalid subject provided" }, { status: 400 });
    }

    // ตั้งค่า Google Auth
    const client = new google.auth.JWT(
        client_email,
        undefined,
        private_key.replace(/\\n/g, '\n'), // กรณี PRIVATE_KEY มี \n ต้องแปลงก่อนให้มันขึ้นบรรทัดใหม่จริง
        ["https://www.googleapis.com/auth/spreadsheets"]
    );
    await client.authorize();
}