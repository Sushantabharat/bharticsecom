
'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'

type DealerFormInputs = {
  name: string
  email: string
  phone: string
  dealerType: string
  companyName: string
  city: string
}

const dealerOptions = [
  'New Car Dealer',
  'Used Car Dealer',
  'OEM',
  'Register Your Service',
]

const DealerRegistrationForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DealerFormInputs>()

  const [message, setMessage] = useState('')

  const onSubmit = async (data: DealerFormInputs) => {
    try {
      const res = await fetch('/api/dealer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (res.ok) {
        setMessage('Registration successful!')
        reset()
      } else {
        setMessage(result.error || 'Registration failed')
      }
    } catch (err) {
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow my-10">
      <h2 className="text-2xl font-semibold mb-4">Become a Dealer</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            {...register('name', { required: 'Name is required' })}
            className="input input-bordered w-full"
            placeholder="John Doe"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: 'Invalid email format',
              },
            })}
            className="input input-bordered w-full"
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium">Phone Number</label>
          <input
            type="tel"
            {...register('phone', {
              required: 'Phone number is required',
              pattern: {
                value: /^[0-9]{10}$/,
                message: 'Enter a valid 10-digit phone number',
              },
            })}
            className="input input-bordered w-full"
            placeholder="9876543210"
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium">Company Name</label>
          <input
            {...register('companyName', { required: 'Company name is required' })}
            className="input input-bordered w-full"
            placeholder="ABC Motors"
          />
          {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName.message}</p>}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium">City</label>
          <input
            {...register('city', { required: 'City is required' })}
            className="input input-bordered w-full"
            placeholder="Mumbai"
          />
          {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
        </div>

        {/* Dealer Type Dropdown */}
        <div>
          <label className="block text-sm font-medium">Dealer Type</label>
          <select
            {...register('dealerType', { required: 'Please select a dealer type' })}
            className="select select-bordered w-full"
          >
            <option value="">-- Select Dealer Type --</option>
            {dealerOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.dealerType && <p className="text-red-500 text-sm">{errors.dealerType.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>

        {/* Message */}
        {message && <p className="text-center mt-2 text-sm text-blue-600">{message}</p>}
      </form>
    </div>
  )
}

export default DealerRegistrationForm
