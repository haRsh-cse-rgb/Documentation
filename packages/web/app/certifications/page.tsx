'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CertificationCard from '@/components/CertificationCard'
import Pagination from '@/components/Pagination'
import { MagnifyingGlassIcon, AcademicCapIcon } from '@heroicons/react/24/outline'

interface Certification {
  certificationId: string
  title: string
  description: string
  provider: string
  category: string
  level: string
  duration: string
  cost: string
  rating: number
  enrollmentCount: number
  certificationLink: string
  syllabus?: string[]
  prerequisites?: string[]
  status: string
}

interface Pagination {
  currentPage: number
  totalPages: number
  totalCertifications: number
  hasNext: boolean
  hasPrev: boolean
}

function CertificationsContent() {
  const searchParams = useSearchParams()
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalCertifications: 0,
    hasNext: false,
    hasPrev: false
  })

  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    provider: searchParams.get('provider') || '',
    level: searchParams.get('level') || '',
    page: parseInt(searchParams.get('page') || '1')
  })

  useEffect(() => {
    fetchCertifications()
  }, [filters])

  const fetchCertifications = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value.toString())
      })

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/certifications?${params.toString()}`)
      const data = await response.json()
      
      setCertifications(data.certifications || [])
      setPagination(data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalCertifications: 0,
        hasNext: false,
        hasPrev: false
      })
    } catch (error) {
      console.error('Error fetching certifications:', error)
      setCertifications([])
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...newFilters, page: 1 })
    
    // Update URL
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && key !== 'page') params.set(key, value.toString())
    })
    
    const newUrl = `/certifications${params.toString() ? `?${params.toString()}` : ''}`
    window.history.pushState({}, '', newUrl)
  }

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page })
    
    // Update URL with page
    const params = new URLSearchParams()
    Object.entries({ ...filters, page }).forEach(([key, value]) => {
      if (value) params.set(key, value.toString())
    })
    
    const newUrl = `/certifications?${params.toString()}`
    window.history.pushState({}, '', newUrl)
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const categories = [
    'Cloud Computing', 'Cybersecurity', 'Data Science', 'AI/ML', 'DevOps',
    'Project Management', 'Digital Marketing', 'Software Development', 'Networking', 'Database'
  ]

  const providers = [
    'AWS', 'Google Cloud', 'Microsoft Azure', 'Coursera', 'edX',
    'Udacity', 'Pluralsight', 'LinkedIn Learning', 'Cisco', 'Oracle'
  ]

  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert']

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {filters.q ? `Search Results for "${filters.q}"` : 'Certifications'}
          </h1>
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${pagination.totalCertifications} certifications found`}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Filters</h3>
              
              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <input
                    type="text"
                    value={filters.q}
                    onChange={(e) => handleFilterChange({ ...filters, q: e.target.value })}
                    placeholder="Certification name, provider..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange({ ...filters, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Provider */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Provider
                  </label>
                  <select
                    value={filters.provider}
                    onChange={(e) => handleFilterChange({ ...filters, provider: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">All Providers</option>
                    {providers.map((provider) => (
                      <option key={provider} value={provider}>
                        {provider}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Level
                  </label>
                  <select
                    value={filters.level}
                    onChange={(e) => handleFilterChange({ ...filters, level: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">All Levels</option>
                    {levels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Certifications List */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-16 bg-gray-200 rounded mb-4"></div>
                    <div className="flex justify-between items-center mb-4">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : certifications.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {certifications.map((certification) => (
                    <CertificationCard key={certification.certificationId} certification={certification} />
                  ))}
                </div>
                
                {pagination.totalPages > 1 && (
                  <div className="mt-12">
                    <Pagination
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No certifications found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or filters to find more certifications.
                </p>
                <button
                  onClick={() => handleFilterChange({
                    q: '',
                    category: '',
                    provider: '',
                    level: '',
                    page: 1
                  })}
                  className="btn-primary"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function CertificationsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="flex gap-8">
              <div className="w-1/4">
                <div className="h-96 bg-gray-200 rounded"></div>
              </div>
              <div className="w-3/4 grid grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    }>
      <CertificationsContent />
    </Suspense>
  )
}