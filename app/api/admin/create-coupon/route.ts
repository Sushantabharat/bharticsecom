
import dbConnect from "@/lib/dbConnect";
import { auth } from "@/lib/auth";
import CouponModel from "@/lib/models/CouponModel";

export const POST = auth(async (...request: any) => {
  const [req] = request;

  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: "Unauthorized" },
      {
        status: 401,
      }
    );
  }

  await dbConnect();

  try {
    const body = await req.json();
    const { code, discount, expiryDate, validCombinations } = body;

    // Validate required fields
    if (!code || !discount || !expiryDate || !Array.isArray(validCombinations)) {
      return Response.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate each combination
    const isValid = validCombinations.every(
      (combo) =>
        combo.brand &&
        combo.fuelType &&
        combo.transmission &&
        typeof combo.brand === "string" &&
        typeof combo.fuelType === "string" &&
        typeof combo.transmission === "string"
    );

    if (!isValid) {
      return Response.json(
        { message: "Each validCombination must include brand, fuelType, and transmission" },
        { status: 400 }
      );
    }

    const exists = await CouponModel.findOne({ code });
    if (exists) {
      return Response.json(
        { message: "Coupon already exists" },
        { status: 400 }
      );
    }

    const coupon = await CouponModel.create({
      code,
      discount,
      expiryDate,
      validCombinations,
    });

    return Response.json({
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    console.error("Error creating coupon:", error);
    return Response.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
});

