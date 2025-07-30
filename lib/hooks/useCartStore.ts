import { create } from 'zustand'
import { round2 } from '../utils'
import { OrderItem, ShippingAddress } from '../models/OrderModel'
import { persist } from 'zustand/middleware'
import { set } from 'mongoose'

type Cart = {
  items: OrderItem[]
  itemsPrice: number
  taxPrice: number
  shippingPrice: number
  totalPrice: number
  paymentMethod: string
  shippingAddress: ShippingAddress
}

const initialState: Cart = {
  items: [],
  itemsPrice: 0,
  taxPrice: 0,
  shippingPrice: 0,
  totalPrice: 0,
  paymentMethod: 'PayPal',
  shippingAddress: {
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  },
}

export const cartStore = create<Cart>()(
  persist(() => initialState, {
    name: 'cartStore',
  })
)

export default function useCartService() {
  const {
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    shippingAddress,
  } = cartStore()
  return {
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    shippingAddress,

    increase: (item: OrderItem) => {
      const exist = items.find((x) => x.slug === item.slug)
      const updatedCartItems = exist
        ? items.map((x) =>
          x.slug === item.slug ? { ...exist, qty: exist.qty + 1 } : x
        )
        : [...items, { ...item, qty: 1 }]
      // toget road price to card function this hooks needto updated
      const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
        calcPrice(updatedCartItems)
      cartStore.setState({
        items: updatedCartItems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
    },
    decrease: (item: OrderItem) => {
      const exist = items.find((x) => x.slug === item.slug)
      if (!exist) return
      const updatedCartItems =
        exist.qty === 1
          ? items.filter((x) => x.slug !== item.slug)
          : items.map((x) =>
            x.slug === item.slug ? { ...exist, qty: exist.qty - 1 } : x
          )

      const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
        calcPrice(updatedCartItems)
      cartStore.setState({
        items: updatedCartItems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
    },
    saveShippingAddrress: (shippingAddress: ShippingAddress) => {
      cartStore.setState({
        shippingAddress,
      })
    },
    savePaymentMethod: (paymentMethod: string) => {
      cartStore.setState({
        paymentMethod,
      })
    },


    setSingleItem: (item: OrderItem) => {
      const updatedCartItems = [{ ...item, qty: 1 }]
      const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calcPrice(updatedCartItems)
      cartStore.setState({
        items: updatedCartItems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
    },

    clear: () => {
      cartStore.setState({
        items: [],
      })
    },
    init: () => cartStore.setState(initialState),
  }
}
// calcucalted price

export const calcPrice = (items: OrderItem[]) => {
  const itemsPrice = items.reduce((acc, item) => acc + item.price * item.qty, 0)
  const taxPrice = itemsPrice * 0.07
  const shippingPrice = itemsPrice > 1000 ? 0 : 100
  const totalPrice = itemsPrice + taxPrice + shippingPrice
  return {
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  }
}
// below code need to check once

// import { create } from 'zustand'
// import { round2 } from '../utils'
// import { OrderItem } from '../models/OrderModel'
// // if new car exshowhowroom if more than 10 lakh then TCS is applicable
// // TCS is 1% on excshowroom
// type Cart = {
//   items: OrderItem[]
//   itemsPrice: number
//   TCS: number
//   shippingPrice: number
//   totalPrice: number
// }

// const initialState: Cart = {
//   items: [],
//   itemsPrice: 0,
//   TCS: 0,
//   shippingPrice: 0,
//   totalPrice: 0,
// }

// export const cartStore = create<Cart>(() => initialState)

// export default function useCartService() {
//   const { items, itemsPrice, TCS, shippingPrice, totalPrice } = cartStore()

//   return {
//     items,
//     itemsPrice,
//     TCS,
//     shippingPrice,
//     totalPrice,
//     increase: (item: OrderItem) => {
//       const exist = items.find((x) => x.slug === item.slug)
//       const updatedCartItems = exist
//         ? items.map((x) =>
//             x.slug === item.slug ? { ...exist, qty: exist.qty + 1 } : x
//           )
//         : [...items, { ...item, qty: 1 }]
//       const { itemsPrice, shippingPrice, TCS, totalPrice } =
//         calculatePrice(updatedCartItems)
//         cartStore.setState({
//           items: updatedCartItems,
//           itemsPrice,
//           TCS,
//           shippingPrice,
//           totalPrice,
//         })
//     },
//   }
// }

// const calculatePrice = (items: OrderItem[]) => {
//   const itemsPrice = round2(
//     items.reduce((acc, item) => acc + item.price * item.qty, 0)
//   )
//   const shippingPrice = round2(itemsPrice > 1000 ? 0 : 100)
//   const TCS = round2(itemsPrice < 1000000 ? 0 : (itemsPrice * 1) / 100)
//   const totalPrice = round2(itemsPrice + shippingPrice + TCS)
//   return { itemsPrice, shippingPrice, TCS, totalPrice }
// }
