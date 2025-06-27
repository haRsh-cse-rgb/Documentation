'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SarkariResultCard from '@/components/SarkariResultCard'
import Pagination from '@/components/Pagination'
import { MagnifyingGlassIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

interface SarkariResult {
  jobId: string
  postName: string
  organization: string
  advertisementNo: string
  resultLink: string
  importantDates: {
    resultDate?: string
    examDate?: string
  }
  status: string
}

interface Pagination {
  currentPage: number
  totalPages: number
  totalResults: number
  hasNext: boolean
  hasPrev: boolean
}

function SarkariResultsContent() {
  const searchParams = useSearchParams()
  const [results, setResults] = useState<SarkariResult[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    hasNext: false,
    hasPrev: false
  })

  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    organization: searchParams.get('organization') || '',
    page: parseInt(searchParams.get('page') || '1')
  })

  useEffect(() => {
    fetchResults()
  }, [filters])

  const fetchResults = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value.toString())
      })

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sarkari-results?${params.toString()}`)
      const data = await response.json()
      
      setResults(data.results || [])
      setPagination(data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalResults: 0,
        hasNext: false,
        hasPrev: false
      })
    } catch (error) {
      console.error('Error fetching sarkari results:', error)
      setResults([])
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
    
    const newUrl = `/sarkari-results${params.toString() ? `?${params.toString()}` : ''}`
    window.history.pushState({}, '', newUrl)
  }

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page })
    
    // Update URL with page
    const params = new URLSearchParams()
    Object.entries({ ...filters, page }).forEach(([key, value]) => {
      if (value) params.set(key, value.toString())
    })
    
    const newUrl = `/sarkari-results?${params.toString()}`
    window.history.pushState({}, '', newUrl)
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const organizations = [
    'UPSC', 'SSC', 'IBPS', 'SBI', 'RBI', 'Railway', 'DRDO', 'ISRO',
    'GATE', 'UGC NET', 'CSIR', 'NEET', 'JEE', 'CAT'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {filters.q ? `Search Results for "${filters.q}"` : 'Sarkari Results'}
          </h1>
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${pagination.totalResults} results found`}
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
                    placeholder="Post name, organization..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Organization */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization
                  </label>
                  <select
                    value={filters.organization}
                    onChange={(e) => handleFilterChange({ ...filters, organization: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">All Organizations</option>
                    {organizations.map((org) => (
                      <option key={org} value={org}>
                        {org}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="space-y-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 animate-pulse">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      </div>
                      <div className="w-24 h-8 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex space-x-4">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              <>
                <div className="space-y-6">
                  {results.map((result) => (
                    <SarkariResultCard key={result.jobId} result={result} />
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
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or filters to find more results.
                </p>
                <button
                  onClick={() => handleFilterChange({
                    q: '',
                    organization: '',
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

export default function SarkariResultsPage() {
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
              <div className="w-3/4 space-y-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    }>
      <SarkariResultsContent />
    </Suspense>
  )
}