'use client'

import { useState, useEffect } from 'react'
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface Filters {
  q: string
  category: string
  location: string
  batch: string
  tags: string
  page: number
}

interface JobFiltersProps {
  filters: Filters
  onFilterChange: (filters: Filters) => void
}

const categories = [
  { value: 'software', label: 'Software Development' },
  { value: 'data-science', label: 'Data Science' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'devops', label: 'DevOps' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'sales', label: 'Sales' },
  { value: 'education', label: 'Education' }
]

const locations = [
  'Bangalore',
  'Mumbai',
  'Delhi',
  'Hyderabad',
  'Pune',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
  'Gurgaon',
  'Noida'
]

const batches = [
  '2024',
  '2023',
  '2022',
  '2021',
  '2020'
]

const popularTags = [
  'JavaScript',
  'React',
  'Node.js',
  'Python',
  'Java',
  'AWS',
  'Docker',
  'Kubernetes',
  'MongoDB',
  'PostgreSQL'
]

export default function JobFilters({ filters, onFilterChange }: JobFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleFilterChange = (key: keyof Filters, value: string) => {
    const newFilters = { ...localFilters, [key]: value, page: 1 }
    setLocalFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      q: '',
      category: '',
      location: '',
      batch: '',
      tags: '',
      page: 1
    }
    setLocalFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const hasActiveFilters = Object.entries(localFilters).some(([key, value]) => 
    key !== 'page' && value !== ''
  )

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-4 py-2 bg-white border border-gray-300 rounded-lg"
        >
          <span className="flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                Active
              </span>
            )}
          </span>
          <XMarkIcon className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-45' : ''}`} />
        </button>
      </div>

      {/* Filters Panel */}
      <div className={`bg-white rounded-xl border border-gray-200 p-6 ${isOpen ? 'block' : 'hidden lg:block'}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="space-y-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              value={localFilters.q}
              onChange={(e) => handleFilterChange('q', e.target.value)}
              placeholder="Job title, keywords..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={localFilters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <select
              value={localFilters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Batch */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Batch Year
            </label>
            <select
              value={localFilters.batch}
              onChange={(e) => handleFilterChange('batch', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Batches</option>
              {batches.map((batch) => (
                <option key={batch} value={batch}>
                  {batch}
                </option>
              ))}
            </select>
          </div>

          {/* Popular Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Popular Skills
            </label>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleFilterChange('tags', localFilters.tags === tag ? '' : tag)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    localFilters.tags === tag
                      ? 'bg-primary-100 border-primary-300 text-primary-700'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Tags Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Skill/Tag
            </label>
            <input
              type="text"
              value={localFilters.tags}
              onChange={(e) => handleFilterChange('tags', e.target.value)}
              placeholder="Enter skill or tag..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </>
  )
}