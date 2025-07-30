import dbConnect from "@/lib/dbConnect";
import { auth } from "@/lib/auth";

import CouponModel from "@/lib/models/CouponModel";
import { NextResponse } from "next/server";

export const GET = auth(async () => {
  try {
    await dbConnect();
    const coupons = await CouponModel.find().sort({ createdAt: -1 });
    return NextResponse.json(coupons);
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      {
        status: 500,
      }
    );
  }
})
