import ProductItem from '@/components/products/ProductItem'
import { Metadata } from 'next'
import productService from '@/lib/services/productService'
import { convertDocToObj } from '@/lib/utils'
import BrandCarousel from '@/components/Carousel'

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'Carsbhartics',
  description:
    process.env.NEXT_PUBLIC_APP_DESC ||
    'Nextjs, Server components, Next auth, daisyui, zustand',
}

export default async function Home() {
  const featuredProducts = await productService.getFeatured()
  const latestProducts = await productService.getLatest()

  // Group products by brand
  const productsByBrand = latestProducts.reduce(
    (acc: Record<string, typeof latestProducts>, product) => {
      const brand = product.brand || 'Other'
      if (!acc[brand]) acc[brand] = []
      acc[brand].push(product)
      return acc
    },
    {}
  )

  return (
    <>
      {/*Carousel If Needed In future*/}
      {/* <div className="w-full carousel rounded-box mt-4">
        {featuredProducts.map((product, index) => (
          <div key={product._id} id={`slide-${index}`} className="carousel-item relative w-full">
            <Link href={`/product/${product.slug}`} className="ml-20">
              <img src={product.banner} className="w-full" alt={product.name} />
            </Link>
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <a href={`#slide-${index === 0 ? featuredProducts.length - 1 : 0}`} className="btn btn-circle">❮</a>
              <a href={`#slide-${(index + 1) % featuredProducts.length}`} className="btn btn-circle">❯</a>
            </div>
          </div>
        ))}
      </div> */}

      <h2 className="text-4xl py-2 font-semibold text-center mt-8">Top Selling New Cars</h2>
      {Object.entries(productsByBrand).map(([brand, products]) => (
        <div key={brand} className="mb-8">
          <h3 className="text-2xl ml-2 font-bold mb-2">{brand}</h3>
          <div className="flex flex-wrap gap-6  w-full  ">
            {products.map((product) => (
              <ProductItem key={product.slug} product={convertDocToObj(product)} />
            ))}
          </div>
        </div>

      ))}
      <section className='mt-8 w-full'>
        <BrandCarousel />
      </section>
      <div className="mt-8">
        <section className="bg-gray-100 p-4 rounded-lg text-center">
          <p className="text-lg font-medium">
            Confused what car to buy? Contact <span className="text-primary font-semibold">Bhartics</span> for suggestions.
          </p>
        </section>
      </div>
    </>
  )
}
