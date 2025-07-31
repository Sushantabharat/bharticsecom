'use client'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

type Inputs = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

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

const Form = () => {
  const { data: session } = useSession()

  const params = useSearchParams()
  const router = useRouter()
  let callbackUrl = params.get('callbackUrl') || '/'
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })
  const passwordValue = watch('password')
  const passwordStrength = getPasswordStrength(passwordValue || '')
  useEffect(() => {
    if (session && session.user) {
      router.push(callbackUrl)
    }
  }, [callbackUrl, params, router, session])

  const formSubmit: SubmitHandler<Inputs> = async (form) => {
    const { name, email, password } = form

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })
      if (res.ok) {
        return router.push(
          `/signin?callbackUrl=${callbackUrl}&success=Account has been created`
        )
      } else {
        const data = await res.json()
        throw new Error(data.message)
      }
    } catch (err: any) {
      const error =
        err.message && err.message.indexOf('E11000') === 0
          ? 'Email already register'
          : err.message
      toast.error(error || 'error')
    }
  }
  return (
    <div className="max-w-sm  mx-auto card bg-base-300 my-4">
      <div className="card-body">
        <h1 className="card-title">Register</h1>
        <form onSubmit={handleSubmit(formSubmit)}>
          <div className="my-2">
            <label className="label" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              {...register('name', {
                required: 'Name is required',
              })}
              className="input input-bordered w-full max-w-sm"
            />
            {errors.name?.message && (
              <div className="text-error">{errors.name.message}</div>
            )}
          </div>
          <div className="my-2">
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              type="text"
              id="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                  message: 'Email is invalid',
                },
              })}
              className="input input-bordered w-full max-w-sm"
            />
            {errors.email?.message && (
              <div className="text-error"> {errors.email.message}</div>
            )}
          </div>
          <div className="my-2">
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register('password', {
                required: 'Password is required',
              })}
              className="input input-bordered w-full max-w-sm"
            />
            {errors.password?.message && (
              <div className="text-error">{errors.password.message}</div>
            )}
          </div>
          <div className="my-2">
            <label className="label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...register('confirmPassword', {
                required: 'Confirm Password is required',
                validate: (value) => {
                  const { password } = getValues()
                  return password === value || 'Passwords should match!'
                },
              })}
              className="input input-bordered w-full max-w-sm"
            />
            {errors.confirmPassword?.message && (
              <div className="text-error">{errors.confirmPassword.message}</div>
            )}
            {passwordValue && (

              <p className={`text-sm mb-1 font-medium ${passwordStrength.color}`}>
                Strength: {passwordStrength.label}
              </p>
            )}
          </div>
          <div className="my-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full"
            >
              {isSubmitting && (
                <span className="loading loading-spinner"></span>
              )}
              Register
            </button>
          </div>
        </form>

        <div className="divider"> </div>
        <div>
          Already have an account?{' '}
          <Link className="link" href={`/signin?callbackUrl=${callbackUrl}`}>
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Form
