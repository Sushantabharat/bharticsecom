
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

type MatchCombination = {
  brand: string
  fuelType: string
  transmission: string
}

type CouponFormInputs = {
  code: string
  discount: number
  expiryDate: string
}

type Props = {
  onSuccess?: () => void
}

const CreateCouponForm = ({ onSuccess }: Props) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm<CouponFormInputs>()
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [matchConditions, setMatchConditions] = useState<MatchCombination[]>([])
  const [combo, setCombo] = useState<MatchCombination>({
    brand: '',
    fuelType: '',
    transmission: '',
  })

  const addCombination = () => {
    const { brand, fuelType, transmission } = combo
    if (!brand || !fuelType || !transmission) {
      toast.error('All fields are required for a match condition')
      return
    }

    setMatchConditions((prev) => [...prev, {
      brand: brand.toUpperCase(),
      fuelType: fuelType.toUpperCase(),
      transmission: transmission.toUpperCase()
    }])
    setCombo({ brand: '', fuelType: '', transmission: '' })
  }

  const onSubmit = async (data: CouponFormInputs) => {
    if (matchConditions.length === 0) {
      toast.error('Add at least one matching condition')
      return
    }

    const fullDateTime = new Date(`${date}T${time}`)
    const formattedExpiry = fullDateTime.toISOString()

    const res = await fetch('/api/admin/create-coupon', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: data.code.toUpperCase(),
        discount: data.discount,
        expiryDate: formattedExpiry,
        validCombinations: matchConditions,
      }),
    })

    if (res.ok) {
      toast.success('Coupon created!')
      onSuccess?.()
      reset()
      setMatchConditions([])
    } else {
      toast.error('Failed to create coupon')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-md p-4 border rounded-md">
      <input
        {...register('code')}
        placeholder="COUPON CODE"
        className="border p-2 uppercase"
        onChange={(e) => setValue('code', e.target.value.toUpperCase())}
        value={watch('code') || ''}
      />

      <input
        {...register('discount')}
        type="number"
        placeholder="Discount (%)"
        className="border p-2"
      />

      <div className="flex gap-2">
        <label className="flex flex-col w-full">
          Expiry Date
          <input type="date" onChange={(e) => setDate(e.target.value)} className="border p-2" />
        </label>
        <label className="flex flex-col w-full">
          Expiry Time
          <input type="time" onChange={(e) => setTime(e.target.value)} className="border p-2" />
        </label>
      </div>

      <div className="border p-3 rounded flex flex-col gap-2">
        <span className="font-semibold">Add Matching Conditions (All 3 fields required)</span>
        <div className="flex gap-2 flex-wrap">
          <input
            value={combo.brand}
            onChange={(e) => setCombo({ ...combo, brand: e.target.value })}
            placeholder="Brand"
            className="border p-2 uppercase flex-1"
          />
          <input
            value={combo.fuelType}
            onChange={(e) => setCombo({ ...combo, fuelType: e.target.value })}
            placeholder="Fuel Type"
            className="border p-2 uppercase flex-1"
          />
          <input
            value={combo.transmission}
            onChange={(e) => setCombo({ ...combo, transmission: e.target.value })}
            placeholder="Transmission"
            className="border p-2 uppercase flex-1"
          />
          <button
            type="button"
            className="bg-green-600 text-white px-3 rounded"
            onClick={addCombination}
          >
            Add
          </button>
        </div>

        {matchConditions.length > 0 && (
          <ul className="text-sm mt-2 list-disc list-inside">
            {matchConditions.map((m, i) => (
              <li key={i}>
                {m.brand.toUpperCase()} / {m.fuelType.toUpperCase()} / {m.transmission.toUpperCase()}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button type="submit" className="bg-blue-600 text-white py-2 rounded">
        Create Coupon
      </button>
    </form>
  )
}

export default CreateCouponForm

