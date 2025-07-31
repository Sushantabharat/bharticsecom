import { sendOTP } from "@/lib/mailer";
import { auth } from "@/lib/auth";

import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/lib/models/UserModels";
import redis from "@/lib/redis";

export async function POST(req: any) {

  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    await dbConnect();
    // Check if the email exists in the database
    const userExists = await UserModel.findOne({ email })
    if (!userExists) {
      return NextResponse.json({ message: "No Account Found with this email" }, { status: 404 });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
    await redis.set(`otp:${email}`, otp, 'EX', 300);
    console.log("Generated OTP:", otp);
    await sendOTP(email, otp);
    return NextResponse.json({ message: "OTP sent successfully " });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}

