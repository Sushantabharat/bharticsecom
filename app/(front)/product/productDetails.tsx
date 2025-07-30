'use client'
import React, { useState } from 'react'
import { MoveLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Dropdown } from '@/components/ui/dropdown'
import { Product, ProductVariant } from '@/lib/models/ProductModels'
import AddToCart from '@/components/products/AddToCart'
import { convertDocToObj } from '@/lib/utils'
import { IoIosGitPullRequest } from 'react-icons/io'

export default function ProductDetailsClient({ product }: { product: Product }) {
  console.log("This is  the product details page for", product)
  const [selectedVariant, setSelectedVariant] = useState(product.variant[0])
  const isUsed = product.type === 'USED';
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product?.avilableColors?.[0]
  )
  const [couponCode, setCouponCode] = useState('')
  const [couponData, setCouponData] = useState<null | { code: string, discount: number }>()

  const handleApplyCoupon = async () => {
    if (!couponCode) return
    try {

      if (!selectedVariant?.fuelType || !selectedVariant?.transmission) {
        alert('Please select a variant with fuel type and transmission')
        return
      }
      const res = await fetch(`/api/coupon/validate?code=${couponCode}&brand=${product.brand}&fuelType=${selectedVariant?.fuelType.toUpperCase()}&transmission=${selectedVariant.transmission.toUpperCase()}`)
      const data = await res.json()

      if (res.ok) {
        setCouponData(data)
      } else {
        alert(data.message || 'Invalid coupon')
      }
    } catch (error) {
      alert('Failed to apply coupon')
    }
  }

  const handleRemoveCoupon = () => {
    setCouponCode('')
    setCouponData(null)
  }
  const {
    exShowroomPrice = 0,
    insurance = 0,
    roadtax = 0,
    discount = 0,
    originalPrice = 0
  } = selectedVariant;

  const isTCSApplicable = exShowroomPrice > 1000000;
  const couponDiscount = couponData?.discount || 0;

  let finalPrice = 0;
  if (product.type === "USED") {
    finalPrice = originalPrice - discount - couponDiscount
  }
  if (product.type !== "USED") {
    if (selectedVariant?.TCS === undefined || selectedVariant.TCS === null) {
      throw new Error("TCS is required");
    }

    finalPrice = exShowroomPrice + insurance + roadtax + selectedVariant.TCS - (discount + couponDiscount);
  }
  return (
    <>
      <div className="my-2">
        <Link href="/" className="btn btn-ghost">
          <MoveLeft /> Back to products
        </Link>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold">
        {product.brand} {product.name}
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Image
            src={product.image as string}
            alt={product.name as string}
            width={800}
            height={500}
            sizes="100vw"
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        <div>
          <div className="card bg-base-300 shadow-xl mt-3 md:mt-0">
            <div className="card-body">
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  {isUsed && isUsed ? (
                    <>
                      <span>Original Price</span>
                      <span>₹{selectedVariant?.exShowroomPrice || selectedVariant?.originalPrice}</span>
                    </>
                  ) : (
                    <>
                      <span>Ex-showroom</span>
                      <span>₹{selectedVariant?.exShowroomPrice}</span>
                    </>
                  )
                  }
                </div>
                <div className="flex justify-between">
                  {

                    isUsed ? (

                      <span className='hidden' />
                    ) : (
                      <> <span>Insurance</span>
                        <span>₹{selectedVariant?.insurance}</span></>
                    )
                  }
                </div>
                <div className="flex justify-between">
                  {
                    isUsed ? (
                      <span className='hidden'>noting</span>
                    ) : (
                      <> <span>Road Tax</span>
                        <span>₹{selectedVariant?.roadtax}</span></>
                    )
                  }
                </div>
                {
                  isTCSApplicable && isUsed === false ? (
                    <div className="flex justify-between">
                      <span>TCS (1%)</span>
                      <span>₹{selectedVariant?.TCS}</span>
                    </div>
                  ) :
                    <span className='hidden'>noting</span>
                }

                <div className="flex justify-between font-bold">
                  {
                    isUsed ? (
                      <span className='hidden' />
                    ) : (
                      <>
                        <span>On-Road Price</span>
                        <span>₹{selectedVariant.onroadPrice}</span>
                      </>
                    )
                  }
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span>₹{selectedVariant.discount}</span>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    className="input input-bordered w-full"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    disabled={!!couponData}
                  />
                  {!couponData ? (
                    <button onClick={handleApplyCoupon} className="btn btn-primary">Apply</button>
                  ) : (
                    <button onClick={handleRemoveCoupon} className="btn btn-error">Remove</button>
                  )}
                </div>

                {couponData && (
                  <div className="text-green-600 text-sm mt-1">
                    Coupon <strong>{couponData?.code}</strong> applied - ₹{couponData.discount} off
                  </div>
                )}
                <div className="flex justify-between text-blue-600 font-semibold">
                  <span>Final Price</span>
                  <span>₹{finalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <span>{product.countInStock && product?.countInStock > 0 ? 'Ready to Deliver' : 'Awaiting'}</span>
                </div>
              </div>

              {product.countInStock && product?.countInStock > 0 && (
                <div className="card-actions justify-center mt-4">
                  <AddToCart
                    item={{
                      ...convertDocToObj(product),
                      qty: 0,
                      color: selectedColor,
                      variant: selectedVariant.name,
                      price: finalPrice,
                      couponDiscount: couponData ? couponData.discount : 0
                    }}
                  />
                </div>
              )}

              <div className="card-actions justify-center mt-4">
                <button className="btn btn-success w-full">Know Your EMI</button>
                <button className="btn btn-info w-full">Book Test Drive</button>
              </div>
            </div>
          </div>
        </div>

        {isUsed === false ? (
          <div>
            <Dropdown
              variants={product.variant}
              onSelect={(variant) => setSelectedVariant(variant)}
              placeholder={'Select Car Variant'}
            />
            <div className="mt-8">
              <div className="flex gap-2 flex-wrap">
                {product?.avilableColors?.map((color: string) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'ring-2 ring-blue-500' : 'border-gray-300'
                      }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                  />
                ))}
              </div>
              {selectedColor && (
                <div className="mt-2 text-sm text-gray-600">Selected: {selectedColor}</div>
              )}
            </div>
          </div>) : (
          <div className="mt-8">
            <div className="flex gap-2 flex-wrap">
              {product?.avilableColors?.map((color: string) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'ring-2 ring-blue-500' : 'border-gray-300'
                    }`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  onClick={() => setSelectedColor(color)}
                  title={color}
                />
              ))}
            </div>
            {selectedColor && (
              <div className="mt-2 text-sm text-gray-600">Selected: {selectedColor}</div>
            )}
          </div>
        )
        }
      </div>
      <div className=' relative rounded-lg shadow-lg bg-white p-4 mt-4'>
        <h2 className='text-xl py-2 px-2'>Features</h2>
        {

          selectedVariant && (
            <div className='flex flex-wrap gap-2  rounded-lg'>
              {selectedVariant?.features?.map((feature, index) => (
                <span key={index} className="py-4 border border-fuchsia-500 px-2 rounded-lg  shadow-md w-fit" >
                  {feature}
                </span>
              ))}
            </div>
          )
        }
      </div>
      <div className='relative rounded-lg shadow-lg bg-white p-4 my-4 flex flex-col gap-2'>
        <h2 className='text-xl py-2 px-2'>Selection Summary</h2>
        <p className='text-gray-500 font-bold'>Variant name : <span className='text-black font-bold capitalize'>{selectedVariant.name}</span></p>
        <p className='text-gray-500 font-bold'>Transmission : <span className='text-black font-bold capitalize'>{selectedVariant.transmission}</span></p>
        <p className='text-gray-500 font-bold'>Variant fuel-type : <span className='text-black font-bold capitalize'>{selectedVariant.fuelType}</span></p>
        {isUsed && (
          <p className='text-gray-500 font-bold'>Total Trip  : <span className='text-black font-bold capitalize'>{selectedVariant.totalTrip} KM</span></p>
        )}
        <p className='text-gray-500 font-bold'>Color  : <span className='ml-2 mr-2'

          style={{ backgroundColor: selectedColor?.toLowerCase(), padding: '2px 12px', borderRadius: '50px', border: `1px solid black` }}
        />{selectedColor}</p>
        <p className='text-gray-500 font-bold'>Final Price: <span className='text-black font-bold capitalize'>₹{finalPrice}</span></p>
      </div >
    </>
  )
}
