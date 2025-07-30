
'use client'
import useSWRMutation from 'swr/mutation'
import useSWR from 'swr'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Dropdown } from '@/components/ui/dropdown'
import { useEffect, useState } from 'react'
import { Product, ProductVariant } from '@/lib/models/ProductModels'
import { formatId } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { TagInput } from '@/components/TagInput'

export default function ProductEditForm({ productId }: { productId: string }) {
  const [formData, setFormData] = useState<Partial<Product>>({})
  const [colorInput, setColorInput] = useState('')
  const router = useRouter()
  const { data, error } = useSWR(`/api/admin/products/${productId}`)

  const { trigger: updateProduct, isMutating: isUpdating } = useSWRMutation(
    `/api/admin/products/${productId}`,
    async (url, { arg }: { arg: Product }) => {
      const res = await fetch(`${url}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(arg),
      })
      const resData = await res.json()
      if (!res.ok) return toast.error(resData.message)
      toast.success('Product updated successfully')
      router.push('/admin/products')
    }
  )

  useEffect(() => {
    if (data) {
      setFormData(data)
      setColorInput((data.avilableColors || []).join(', '))
    }
  }, [data])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'type') {
      setFormData((prev) => ({
        ...prev,
        type: value.toUpperCase() as 'NEW' | 'USED',
      }))
      return
    }
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleVariantChange = (
    index: number,
    field: keyof ProductVariant,
    value: string | number | string[]
  ) => {
    setFormData((prev) => {
      const variants = [...(prev.variant || [])]
      const current = { ...variants[index], [field]: value }
      variants[index] = current
      return { ...prev, variant: variants }
    })
  }



  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variant: [
        ...(prev.variant || []),
        {
          name: '',
          model: '',
          fuelType: 'PETROL',
          transmission: 'MANUAL',
          insurance: 0,
          exShowroomPrice: 0,
          roadtax: 0,
          onroadPrice: 0,
          totalTrip: 0,
          discount: 0,
          onroadAfterDiscount: 0,
          features: [],
          TCS: 0,
        },
      ],
    }))
  }

  const removeVariant = (index: number) => {
    setFormData((prev) => {
      const variants = [...(prev.variant || [])]
      variants.splice(index, 1)
      return { ...prev, variant: variants }
    })
  }

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault()
    const updatedProduct: Product = {
      ...(formData as Product),
      avilableColors: colorInput.split(',').map((c) => c.trim()).filter(Boolean),
    }

    await updateProduct(updatedProduct)
  }

  const uploadHandler = async (e: any) => {
    const toastId = toast.loading('Uploading image...')
    try {
      const resSign = await fetch('/api/cloudinary-sign', { method: 'POST' })
      const { signature, timestamp } = await resSign.json()
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append('file', file)
      formData.append('signature', signature)
      formData.append('timestamp', timestamp)
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!)
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )
      const data = await res.json()
      setFormData((prev) => ({ ...prev, image: data.secure_url }))
      toast.success('File uploaded successfully', { id: toastId })
    } catch (err: any) {
      toast.error(err.message, { id: toastId })
    }
  }

  if (error) return error.message
  if (!data) return 'Loading...'

  return (
    <form onSubmit={submitHandler}>
      <h1 className="text-2xl py-4">Edit Product {formatId(productId)}</h1>

      {[
        'name',
        'slug',
        'image',
        'year',
        'category',
        'brand',
        'description',
        'countInStock',
      ].map((field) => (
        <div key={field} className="mb-4">
          <label className="label capitalize">{field}</label>
          <Input
            name={field}
            value={(formData as any)[field] || ''}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
      ))}
      <div className="mb-4">
        <label className="label capitalize">Type</label>

        <select
          value={formData.type || ''}
          name="type"
          onChange={handleChange}
          className='w-full py-3 bg-white rounded-md px-2'
        >
          <option value="" disabled className='bg-whte shadow-md'>Select Type</option>
          <option value="NEW">NEW</option>
          <option value="USED">USED</option>
        </select>

      </div>
      <div className="mb-4">
        <label className="label">Upload Image</label>
        <input type="file" onChange={uploadHandler} className="file-input w-full" />
      </div>

      <div className="mb-4">
        <label className="label">Available Colors</label>
        <Input
          value={colorInput}
          onChange={(e) => setColorInput(e.target.value)}
          placeholder="Comma-separated colors"
          className="input input-bordered w-full"
        />
      </div>

      <div className="my-6">
        <h2 className="text-xl font-semibold">Variants</h2>

        {(formData.variant || []).map((variant, index) => (
          <div key={index} className="p-4 border rounded mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Variant {index + 1}</h3>
              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="btn btn-sm btn-error"
              >
                Remove
              </button>
            </div>

            {['name', 'model'].map((key) => {
              const typedKey = key as keyof ProductVariant
              return (
                <div key={key} className="mb-2">
                  <label className="label capitalize">{key}</label>
                  <Input
                    type="text"
                    value={(variant as any)[key] || ''}
                    onChange={(e) => handleVariantChange(index, typedKey, e.target.value)}
                    className="input input-bordered w-full"
                  />
                </div>
              )
            })}

            {formData.type === 'NEW' ? (
              <div className="mb-2">
                <label className="label capitalize">Ex Showroom Price</label>
                <Input
                  type="number"
                  value={variant.exShowroomPrice || ''}
                  onChange={(e) => handleVariantChange(index, 'exShowroomPrice', Number(e.target.value))}
                  className="input input-bordered w-full"
                />
              </div>
            ) : (
              <div className="mb-2">
                <label className="label capitalize">Original Price</label>
                <Input
                  type="number"
                  value={variant.originalPrice || ''}
                  onChange={(e) => handleVariantChange(index, 'originalPrice', Number(e.target.value))}
                  className="input input-bordered w-full"
                />
              </div>
            )}

            <div className="mb-2">
              <label className="label">Discount</label>
              <Input
                type="number"
                value={variant.discount || ''}
                onChange={(e) => handleVariantChange(index, 'discount', Number(e.target.value))}
                className="input input-bordered w-full"
              />
            </div>

            <div className="mb-3">
              <label className="label">Fuel Type</label>
              <Dropdown
                placeholder="Select Fuel Type"
                variants={['PETROL', 'DIESEL', 'ELECTRIC'].map((fuel) => ({
                  name: fuel,
                }))}
                onSelect={(selected) => selected.name && handleVariantChange(index, 'fuelType', selected.name)}
              />
            </div>

            <div className="mb-3">
              <label className="label">Transmission</label>
              <Dropdown
                placeholder="Select Transmission"
                variants={['MANUAL', 'AUTOMATIC', 'CVT', 'AMT', 'DCT'].map((type) => ({
                  name: type,
                }))}
                onSelect={(selected) => selected.name && handleVariantChange(index, 'transmission', selected.name)}
              />
            </div>
            {formData.type === 'USED' && (
              <div className="mb-3">
                <label className="label">Total Trip (KM)</label>
                <Input
                  type="number"
                  value={variant.totalTrip || ''}
                  onChange={(e) => handleVariantChange(index, 'totalTrip', Number(e.target.value))}
                  className="input input-bordered w-full"
                />
              </div>)
            }
            <div className="mb-2">
              <TagInput
                value={variant.features || []}
                onChange={(newTags) => handleVariantChange(index, 'features', newTags)}
                placeholder="Enter features and press Enter or comma"
              />
            </div>

            {/* Disabled fields for USED */}
            {formData.type === 'NEW' && (
              <>
                <div className="mb-2">
                  <label className="label">Insurance</label>
                  <Input
                    type="number"
                    value={variant.insurance || ''}
                    onChange={(e) => handleVariantChange(index, 'insurance', Number(e.target.value))}
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="mb-2">
                  <label className="label">Road Tax</label>
                  <Input
                    type="number"
                    value={variant.roadtax || ''}
                    onChange={(e) => handleVariantChange(index, 'roadtax', Number(e.target.value))}
                    className="input input-bordered w-full"
                  />
                </div>
              </>
            )}
          </div>
        ))}

        <button type="button" onClick={addVariant} className="btn btn-secondary">
          Add Variant
        </button>
      </div>

      <button type="submit" className="btn btn-primary" disabled={isUpdating}>
        {isUpdating && <span className="loading loading-spinner"></span>}
        Update
      </button>
      <Link href="/admin/products" className="btn ml-4">
        Cancel
      </Link>
    </form>
  )
}

