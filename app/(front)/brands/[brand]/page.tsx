import ProductItem from "@/components/products/ProductItem"
import dbConnect from "@/lib/dbConnect"
import ProductModel from "@/lib/models/ProductModels"
import { convertDocToObj } from "@/lib/utils"
type Props = {
  params: { brand: string }
}
export default async function BrandPage({ params }: Props) {
  await dbConnect()
  const cars = await ProductModel.find({ brand: { $regex: new RegExp(params.brand, 'i') } })
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 capitalize">
        All {params.brand} Cars
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {cars.map((car) => (
          <ProductItem key={car.slug} product={convertDocToObj(car)} />
        ))}
      </div>
    </div>
  )
}
