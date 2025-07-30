
import dbConnect from '@/lib/dbConnect'
import CouponModel from '@/lib/models/CouponModel'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const brand = searchParams.get('brand')
  const fuelType = searchParams.get('fuelType')
  const transmission = searchParams.get('transmission')

  if (!code || !brand || !fuelType || !transmission) {
    return Response.json({ message: 'Code, brand, fuelType, and transmission are required' }, { status: 400 })
  }

  await dbConnect()
  const coupon = await CouponModel.findOne({ code })

  if (!coupon) {
    return Response.json({ message: 'Coupon not found' }, { status: 404 })
  }

  const now = new Date()
  if (now > new Date(coupon.expiryDate)) {
    return Response.json({ message: 'Coupon expired' }, { status: 400 })
  }

  const isValidCombination = coupon.validCombinations.some((combo: any) => (
    combo.brand === brand &&
    combo.fuelType === fuelType &&
    combo.transmission === transmission
  ))

  if (!isValidCombination) {
    return Response.json({ message: 'Invalid combination for this coupon' }, { status: 400 })
  }

  return Response.json({ code: coupon.code, discount: coupon.discount })
}

