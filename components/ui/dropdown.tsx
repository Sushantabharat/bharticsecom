'use client'
import React from 'react'

import { ChevronDown } from 'lucide-react'
import { ProductVariant } from '@/lib/models/ProductModels'
import { useState, useRef, useEffect } from 'react'
export type VariantOption = {
  name: 'NEW' | 'USED';
};
interface CarVariantDropdownProps {
  variants: ProductVariant[]
  onSelect: (variant: ProductVariant) => void
  placeholder?: string
}
export const Dropdown = ({ variants, onSelect, placeholder }: CarVariantDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant)
    setIsOpen(false)
    onSelect(variant)
  }

  return (
    <div className="relative w-full my-6" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        <span className="text-left">
          {selectedVariant ? (
            <div>
              <div className="font-medium text-gray-900 capitalize">{selectedVariant.name}</div>
              <div className="text-sm text-gray-500 ">
                {selectedVariant.name}  {selectedVariant.exShowroomPrice}
              </div>
            </div>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-auto">
          {variants.map((variant) => (
            <button
              key={variant.name}
              type="button"
              onClick={() => handleSelect(variant)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="font-medium text-gray-900">{variant.name}</div>
              <div className="text-sm text-gray-500 mt-1">
                {variant.transmission}  <span className="font-semibold text-blue-600">{variant.exShowroomPrice}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
