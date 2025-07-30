
import mongoose from "mongoose";

const ValidCombinationSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  fuelType: { type: String, required: true },
  transmission: { type: String, required: true },
});

const CouponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    validCombinations: [ValidCombinationSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Coupon ||
  mongoose.model("Coupon", CouponSchema);

