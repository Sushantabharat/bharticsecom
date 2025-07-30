'use client'
import { useRouter } from 'next/navigation'
import { Product } from '@/lib/models/ProductModels'
import { Cog, Fuel, Palette } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
export default function ProductItem({ product }: { product: Product }) {
  const router = useRouter()
  if (!product) {
    return (
      <div>No Data Found </div>
    )
  }
  console.log("This is the product item", product)

  if (product.type === "USED") {
    return (
      <div className="min-w-[200px] max-w-[400px] w-[400px] lg:w-[400px] md:w-[350px] bg-white rounded-lg flex flex-col shadow-xl  mb-4 ">
        <div className='py-1 text-right px-2 rounded-md    shadow-md  text-xs  bg-white '><span className='border-2 border-neutral-300 rounded-md shadow-lg px-2'>{product?.type?.toUpperCase()}</span></div>
        <figure>
          <Link href={`/product/${product.slug}`}>
            <Image
              src={product?.image as string}
              alt={product?.name as string}
              width={300}
              height={300}
              className="object-cover h-64 w-full"
            />
          </Link>
        </figure>
        <div className="py-4 px-4">
          <Link href={`/product/${product.slug}`}>
            <h2 className="card-title text-left font-bold">{product?.brand} {product?.name}</h2>
            <p className="text-neutral-600"><span className='text-black font-semibold'>Model : </span>{product?.variant[0]?.model}</p>
            <div className="card-actions   ">
              <ul className="grid grid-cols-2 gird-rows-2 gap-x-8">
                <li className="text-sm font-semibold text-gray-500 flex items-center gap-1">
                  <Fuel size={16} className='text-black' />
                  {product.variant[0].fuelType && product?.variant[0]?.fuelType.toUpperCase()}
                </li>
                <li className="text-sm text-gray-500">
                  <span className='text-black font-semibold'>Year : </span>{product?.year}
                </li>
                <li className="text-sm text-gray-500 flex items-center gap-1">
                  <Cog size={16} className='text-black' />
                  {product.variant[0].transmission && product?.variant[0]?.transmission.toUpperCase()}
                </li>
                <li className="text-sm text-gray-500 flex items-center gap-1">
                  <Palette size={16} className='text-black font-semibold' />
                  {product.avilableColors && product?.avilableColors[0]?.toUpperCase()}
                </li>
              </ul>
            </div>

          </Link>
          <div className='flex items-center justify-between mt-4'>
            <h3 className='font-semibold text-lg text-fuchsia-500 ' >&#8377;{product?.variant[0]?.originalPrice}</h3>
            <button className='bg-fuchsia-300 text-lg font-semibold rounded-md py-2 px-4' onClick={() => router.push(`/product/${product.slug}`)}> Details</button>
          </div>

        </div>
      </div>
    )
  }
  return (
    <div className="min-w-[200px] max-w-[400px] w-[400px] lg:w-[400px] md:w-[350px] bg-white rounded-lg flex flex-col shadow-xl  mb-4 ">
      <div className='py-1 text-right px-2 rounded-md    shadow-md  text-xs  bg-white '><span className='border-2 border-neutral-300 rounded-md shadow-lg px-2'>{product?.type?.toUpperCase()}</span></div>
      <figure>
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product?.image as string}
            alt={product?.name as string}
            width={300}
            height={300}
            className="object-cover h-64 w-full"
          />
        </Link>
      </figure>
      <div className="py-4 px-4">
        <Link href={`/product/${product.slug}`}>
          <h2 className="card-title text-left font-bold">{product?.brand} {product?.name}</h2>
          <p className="text-neutral-600"><span className='text-black font-semibold'>Model : </span>{product?.variant[0]?.model}</p>
          <div className="card-actions   ">
            <ul className="grid grid-cols-2 gird-rows-2 gap-x-8">
              <li className="text-sm font-semibold text-gray-500 flex items-center gap-1">
                <Fuel size={16} className='text-black' />
                {product.variant[0]?.fuelType && product?.variant[0]?.fuelType.toUpperCase()}
              </li>
              <li className="text-sm text-gray-500">
                <span className='text-black font-semibold'>Year : </span>{product?.year}
              </li>
              <li className="text-sm text-gray-500 flex items-center gap-1">
                <Cog size={16} className='text-black' />
                {product?.variant[0]?.transmission && product?.variant[0]?.transmission.toUpperCase()}
              </li>
              <li className="text-sm text-gray-500 flex items-center gap-1">
                <Palette size={16} className='text-black font-semibold' />
                {product.avilableColors && product?.avilableColors[0]?.toUpperCase()}
              </li>
            </ul>
          </div>

        </Link>
        <div className='flex items-center justify-between mt-4'>
          <h3 className='font-semibold text-lg text-fuchsia-500 ' >&#8377;{product?.variant[0]?.exShowroomPrice}</h3>
          <button className='bg-fuchsia-300 text-lg font-semibold rounded-md py-2 px-4' onClick={() => router.push(`/product/${product.slug}`)}> Details</button>
        </div>

      </div>
    </div>
  )

}
