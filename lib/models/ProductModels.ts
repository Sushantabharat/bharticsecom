import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true, enum: ['NEW', 'USED'] },
    brand: { type: String, required: true },
    year: { type: Number, required: true },
    variant: [
      {
        name: { type: String, required: true },
        model: { type: String, required: true },
        fuelType: { type: String, required: true, enum: ['PETROL', 'DIESEL', 'ELECTRIC'] },
        transmission: { type: String, required: true, enum: ['MANUAL', 'AUTOMATIC', 'CVT', 'AMT', 'DCT'] },
        features: [{ type: String }],
        TCS: { type: Number },
        exShowroomPrice: { type: Number },
        originalPrice: { type: Number },
        insurance: { type: Number },
        roadtax: { type: Number },
        onroadPrice: { type: Number },
        totalTrip: { type: Number, default: 0 },
        discount: { type: Number, required: true },
        onroadAfterDiscount: { type: Number, }
      }
    ],
    avilableColors: { type: [String], required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    banner: String,
  },
  {
    timestamps: true,
  }
)

const ProductModel =
  mongoose.models.Product || mongoose.model('Product', productSchema)

export default ProductModel
export type ProductVariant = {
  name?: string
  model?: string
  fuelType?: 'PETROL' | 'DIESEL' | 'ELECTRIC'
  transmission?: 'MANUAL' | 'AUTOMATIC' | 'CVT' | 'AMT' | 'DCT'
  features?: string[]
  TCS?: number
  insurance?: number
  exShowroomPrice?: number
  originalPrice?: number
  roadtax?: number
  totalTrip?: number
  onroadPrice?: number
  featureInputRaw?: string
  discount?: number
  onroadAfterDiscount?: number
}
export type Product = {
  _id: string
  name?: string
  type?: 'NEW' | 'USED'
  brand?: string
  year?: number
  variant: ProductVariant[]
  avilableColors?: string[]
  slug: string
  category?: string
  image?: string
  rating?: number
  numReviews?: number
  countInStock?: number
  description?: string
  isFeatured?: boolean
  banner?: string
  createdAt?: string
  updatedAt?: string
}
