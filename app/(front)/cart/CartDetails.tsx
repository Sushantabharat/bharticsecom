'use client'

import useCartService from '@/lib/hooks/useCartStore'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function CartDetails() {
  const router = useRouter()
  const { items, itemsPrice, clear } = useCartService()

  console.log("This is items-2", items)
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <></>
  const clearCart = () => {
    clear();
    toast.success("Cart Cleared Successfully")
  }
  return (
    <>
      <h1 className="py-4 text-2xl">Shopping Cart</h1>

      {items.length === 0 ? (
        <div>
          Cart is empty.
          <Link href="/" className="btn btn-secondary test-lg">
            Go shopping
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <table className="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Color</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Variant</th>
                  <th>year</th>
                  <th>Coupon Discount</th>
                  <th>Final Price</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.slug}>
                    <td >
                      <Link
                        href={`/product/${item.slug}`}
                        className="flex flex-col gap-2 "
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={190}
                          height={190}
                        ></Image>
                        <span className="font-bold text-lg">{item.name}</span>
                      </Link>
                    </td>
                    <td>
                      {item?.qty}
                    </td>

                    <td className={`text-${item?.color?.toLowerCase()}-600 font-semibold text-md`}>
                      {item?.color}
                    </td>
                    <td>{item?.category}</td>
                    <td>{item?.type}</td>
                    <td>{item?.variant}</td>
                    <td>{item?.year}</td>
                    <td>&#8377;{item?.couponDiscount}</td>
                    <td>₹{item?.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <div className="card bg-base-300">
              <div className="card-body">
                <ul>
                  <li>
                    <div className="pb-3 text-xl">
                      Subtotal ({items.reduce((a, c) => a + c.qty, 0)}) : ₹
                      {itemsPrice}
                    </div>
                  </li>
                  <li className='flex flex-col gap-2'>

                    <button
                      onClick={() => router.push('/shipping')}
                      className="btn btn-primary w-full"
                    >
                      Proceed to Checkout
                    </button>
                    <button
                      onClick={clearCart}
                      className="btn btn-secondary w-full"
                    >
                      Clear Cart
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
