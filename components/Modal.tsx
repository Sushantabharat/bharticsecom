'use client'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
interface ModalProps {
  isModalOpen: boolean
  setModalOpen: (open: boolean) => void
}

export const Modal: React.FC<ModalProps> = ({ isModalOpen, setModalOpen }) => {
  const router = useRouter();
  const [emailForReset, setEmailForReset] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [isLoading, setLoading] = useState(false)
  const verifyOtp = async (email: string, otp: string) => {
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })
      const data = await res.json()
      if (res.ok) {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`)
        toast.success('OTP verified successfully')
      } else {
        toast.error(data.message || 'Failed to verify OTP')
      }
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong while verifying OTP')
    }
  }
  if (!isModalOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button
          className="absolute top-2 right-2 text-xl"
          onClick={() => {
            setModalOpen(false)
            setEmailForReset('')
            setOtpSent(false)
            setOtp('')
            setLoading(false)
          }}
        >
          &times;
        </button>

        {!otpSent ? (
          <>
            <h2 className="text-lg font-semibold mb-2">Reset Password</h2>
            <input
              type="email"
              placeholder="Enter your email"
              className="input input-bordered w-full mb-4"
              value={emailForReset}
              onChange={(e) => setEmailForReset(e.target.value)}
            />
            <button
              className="btn btn-primary w-full"
              disabled={isLoading}
              onClick={async () => {
                setLoading(true)
                try {
                  const res = await fetch('/api/send-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: emailForReset }),
                  })
                  const data = await res.json()
                  if (res.ok) {
                    toast.success('OTP sent successfully')
                    setOtpSent(true)
                  } else {
                    toast.error(data.message || 'Failed to send OTP')
                  }
                } catch (err) {
                  console.error(err)
                  alert('Something went wrong')
                } finally {
                  setLoading(false)
                }
              }}
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold mb-2">Enter OTP</h2>
            <input
              type="text"
              placeholder="Enter OTP"
              className="input input-bordered w-full mb-4"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              className="btn btn-success w-full"
              onClick={() => verifyOtp(emailForReset, otp)}
            >
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
  )
}

