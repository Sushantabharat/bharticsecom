import UserModel from '@/lib/models/UserModels'
import dbConnect from '@/lib/dbConnect'
import { NextRequest, NextResponse } from 'next/server'
import data from '@/lib/data'
import ProductModel from '@/lib/models/ProductModels'

export const GET = async (request: NextRequest) => {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({
      message: 'This route is only available in development mode',
    }, { status: 403 })
  }
  try {
    const { users, products } = data
    await dbConnect()
    await UserModel.deleteMany()
    await UserModel.insertMany(users)
    await ProductModel.deleteMany()
    await ProductModel.insertMany(products)
    return NextResponse.json({
      message: 'seeded successfully',
      products,
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Seeding failed', error },
      { status: 500 }
    )
  }
}
