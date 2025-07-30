'use client'
import { useState } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import CreateCouponForm from '@/components/admin/CreateCouponForm'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const Coupon = () => {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: coupons, mutate } = useSWR('/api/admin/coupons', fetcher)


  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/admin/delete-coupon/${id}`, {
      method: 'DELETE',
    })

    const result = await res.json()
    if (res.ok) {
      toast.success('Coupon deleted')
      mutate()
    } else {
      toast.error(result.message || 'Failed to delete')
    }
  }

  const isExpired = (date: string) => new Date(date) < new Date()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Coupon
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create New Coupon</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-red-500">
                ✕
              </button>
            </div>
            <CreateCouponForm onSuccess={() => {
              setIsModalOpen(false)
              mutate();
            }} />
          </div>
        </div>
      )}

      {/* COUPON LIST */}
      <div className="grid gap-4 mt-6">
        {coupons?.length === 0 && (
          <p className="text-gray-500">No coupons available.</p>
        )}
        {coupons?.map((coupon: any) => (
          <div key={coupon._id} className="p-4 border rounded-md shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{coupon.code}</h3>
                <p>Discount: &#8377;{coupon.discount}</p>
                <p>Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</p>

                <p className="text-sm text-gray-600">
                  Valid For:{' '}
                  {Array.isArray(coupon.validCombinations) && coupon.validCombinations.length > 0 ? (
                    coupon.validCombinations.map((combo: any) => (
                      <span
                        key={`${combo.brand}-${combo.fuelType}-${combo.transmission}`}
                        className="inline-block mr-2 gap-2"
                      >
                        <span className='text-xs bg-fuchsia-200  ml-2 text-black px-2 py-1 rounded-md'> {combo.brand}</span>
                        <span className='text-xs bg-purple-200 ml-2 text-black px-2 py-1 rounded-md'> {combo.fuelType}</span>
                        <span className='text-xs bg-teal-200 ml-2 text-black px-2 py-1 rounded-md'> {combo.transmission}</span>
                      </span>
                    ))
                  ) : (
                    'ALL'
                  )}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`inline-block px-2 py-1 text-xs rounded ${isExpired(coupon.expiryDate)
                    ? 'bg-red-100 text-red-600'
                    : 'bg-green-100 text-green-600'
                    }`}
                >
                  {isExpired(coupon.expiryDate) ? 'Expired' : 'Active'}
                </span>

                <button
                  onClick={() => handleDelete(coupon._id)}
                  className="block mt-2 pl-2 text-sm text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Coupon

