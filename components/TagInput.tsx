import React, { useState, KeyboardEvent } from 'react'

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

export const TagInput: React.FC<TagInputProps> = ({ value, onChange, placeholder }) => {
  const [input, setInput] = useState('')

  const addTag = () => {
    const newTags = input
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t && !value.includes(t))
    if (newTags.length) {
      onChange([...value, ...newTags])
      setInput('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    }
  }

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag))
  }

  return (
    <div className="w-full border border-gray-300 rounded-md bg-white p-2 flex flex-wrap gap-2">
      {value.map((tag) => (
        <div key={tag} className="flex items-center bg-fuchsia-400/30 text-slate-950 px-2 py-1 rounded-md capitalize text-sm">
          {tag}
          <button type="button" onClick={() => removeTag(tag)} className="ml-1 text-red-500 hover:text-red-700">×</button>
        </div>
      ))}
      <input
        className="flex-1 min-w-[150px] outline-none border-none py-2"
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  )
}
