import dbConnect from '@/lib/dbConnect'
import CouponModel from '@/lib/models/CouponModel'
import { auth } from '@/lib/auth'

export const DELETE = auth(async (req, { params }: any) => {
  const { id } = params
  if (!req.auth?.user?.isAdmin) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }

  await dbConnect()

  const deleted = await CouponModel.findByIdAndDelete(id)
  if (!deleted) {
    return Response.json({ message: 'Coupon not found' }, { status: 404 })
  }

  return Response.json({ message: 'Coupon deleted' })
})
