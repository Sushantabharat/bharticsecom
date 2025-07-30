
'use client'
import useCartService from '@/lib/hooks/useCartStore'
import { OrderItem } from '@/lib/models/OrderModel'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function AddtoCart({ item }: { item: OrderItem }) {
  const { items, increase, clear, setSingleItem } = useCartService()
  const [existItem, setExistItem] = useState<OrderItem | undefined>()
  const [hasOtherItem, setHasOtherItem] = useState(false)

  useEffect(() => {
    const existing = items.find((x) => x.slug === item.slug)
    setExistItem(existing)

    const hasDifferent = items.length > 0 && !existing
    setHasOtherItem(hasDifferent)
  }, [items, item.slug])

  const addToCartHandler = () => {
    clear();
    increase({ ...item, qty: 1 })
    toast.success('Item added to cart')
  }

  const replaceCartHandler = () => {
    setSingleItem(item)
    toast.success('Cart replaced with new item')
  }

  return (
    <>
      {existItem ? (
        <button className="btn btn-warning w-full" onClick={replaceCartHandler}>
          Replace and Add to cart
        </button>
      ) : hasOtherItem ? (
        <button className="btn btn-warning w-full" onClick={replaceCartHandler}>
          Replace and Add to Cart
        </button>
      ) : (
        <button className="btn btn-primary w-full" onClick={addToCartHandler}>
          Add to Cart
        </button>
      )}
    </>
  )
}

