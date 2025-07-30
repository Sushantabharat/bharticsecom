
'use client'
import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

const brands = [
  { name: 'Jaguar', logo: '/brands/Jaguar.svg' },
  { name: 'MG', logo: '/brands/MG.svg' },
  { name: 'Suzuki', logo: '/brands/Suzuki.svg' },
  { name: 'Mini', logo: '/brands/Mini.svg' },

  { name: 'Mini', logo: '/brands/Mini.svg' },
  { name: 'Mini', logo: '/brands/Mini.svg' },
  { name: 'Mini', logo: '/brands/Mini.svg' },
]
export default function BrandCarousel() {
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -400 : 400,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div className="relative w-full px-4">
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full shadow p-2"
      >
        <ChevronLeft />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full shadow p-2"
      >
        <ChevronRight />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto  scorll-hidden scrollbar-hide scroll-smooth py-4 px-14"
      >
        {brands.map((brand) => (
          <div
            key={brand.name}
            className="min-w-[300px] min-h-[250px] cursor-pointer bg-white rounded shadow p-2 flex flex-col items-center justify-center"
            onClick={() => router.push(`/brands/${brand.name.toLowerCase()}`)}
          >
            <Image
              src={brand.logo}
              alt={brand.name}
              width={100}
              height={100}
              className="object-contain"
            />
            <p className="mt-2 text-sm font-semibold text-center">
              {brand.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
