
'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast';

const getPasswordStrength = (password: string): { label: string; color: string } => {
  let score = 0

  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[\W_]/.test(password)) score++

  if (score <= 2) return { label: 'Weak', color: 'text-red-500' }
  if (score === 3 || score === 4) return { label: 'Medium', color: 'text-yellow-500' }
  return { label: 'Strong', color: 'text-green-600' }
}

const isStrongPassword = (password: string) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password)
}

const ResetPasswordPage = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get('email')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const strength = getPasswordStrength(newPassword)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    if (!email) {
      setError('Missing email in URL')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!isStrongPassword(newPassword)) {
      setError('Password is not strong enough')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, newPassword }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')

      setSuccess('Password reset successful. Redirecting to login...')
      toast.success('Password reset successful. Redirecting to login...')
      setTimeout(() => router.push('/signin'), 2000)
    } catch (err: any) {
      toast.error(err.message || 'Failed to reset password')
      setError(err.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Reset Password</h2>

        <input
          type="password"
          placeholder="New Password"
          className="w-full border px-3 py-2 rounded mb-1"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        {newPassword && (
          <p className={`text-sm mb-1 font-medium ${strength.color}`}>
            Strength: {strength.label}
          </p>
        )}

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full border px-3 py-2 rounded mb-1"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />


        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  )
}

export default ResetPasswordPage

