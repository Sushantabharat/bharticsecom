import ProductItem from '@/components/products/ProductItem'
import productService from '@/lib/services/productService'
import { convertDocToObj } from '@/lib/utils'
import React from 'react'

const usedcar = async () => {
  const data = await productService.getByQuery({
    type: "USED",
    category: "all",
    sort: "newest",
    page: "1",
    q: "all",
    price: "all",
    rating: "all",
  })
  if (!data) return <div className="text-center text-red-500">No products found</div>
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 mt-4 ml-4">Preowned Cars</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.products.map((product) => (
          <ProductItem key={product.slug} product={convertDocToObj(product)} />
        ))}
      </div>
    </div>
  )
}

export default usedcar
