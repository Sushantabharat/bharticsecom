import productService from '@/lib/services/productService'
import ProductDetailsClient from '../productDetails'
export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await productService.getBySlug(params.slug)

  if (!product) return <div className="text-center text-red-500">Product not found</div>

  return <ProductDetailsClient product={product} />
}
