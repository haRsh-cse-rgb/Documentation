'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ResumeTipCard from '@/components/ResumeTipCard'
import ResumeTemplates from '@/components/ResumeTemplates'
import Pagination from '@/components/Pagination'
import { MagnifyingGlassIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

interface ResumeTip {
  tipId: string
  title: string
  content: string
  category: string
  level: string
  tags: string[]
  priority: number
  createdAt: string
  status: string
}

interface Pagination {
  currentPage: number
  totalPages: number
  totalTips: number
  hasNext: boolean
  hasPrev: boolean
}

function ResumeTipsContent() {
  const searchParams = useSearchParams()
  const [tips, setTips] = useState<ResumeTip[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('tips')
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalTips: 0,
    hasNext: false,
    hasPrev: false
  })

  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    level: searchParams.get('level') || '',
    page: parseInt(searchParams.get('page') || '1')
  })

  useEffect(() => {
    if (activeTab === 'tips') {
      fetchTips()
    }
  }, [filters, activeTab])

  const fetchTips = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value.toString())
      })

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resume-tips?${params.toString()}`)
      const data = await response.json()
      
      setTips(data.tips || [])
      setPagination(data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalTips: 0,
        hasNext: false,
        hasPrev: false
      })
    } catch (error) {
      console.error('Error fetching resume tips:', error)
      setTips([])
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
    
    const newUrl = `/resume-tips${params.toString() ? `?${params.toString()}` : ''}`
    window.history.pushState({}, '', newUrl)
  }

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page })
    
    // Update URL with page
    const params = new URLSearchParams()
    Object.entries({ ...filters, page }).forEach(([key, value]) => {
      if (value) params.set(key, value.toString())
    })
    
    const newUrl = `/resume-tips?${params.toString()}`
    window.history.pushState({}, '', newUrl)
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const categories = [
    'Writing', 'Formatting', 'Content', 'Keywords', 'ATS Optimization',
    'Industry Specific', 'Experience Level', 'Skills Section', 'Education', 'Projects'
  ]

  const levels = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive', 'All Levels']

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Tips & Templates</h1>
          <p className="text-gray-600">
            Expert advice and templates to help you create a standout resume
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('tips')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'tips'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Resume Tips
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'templates'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Templates
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'tips' ? (
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
                      placeholder="Search tips..."
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

                  {/* Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience Level
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

            {/* Tips List */}
            <div className="lg:w-3/4">
              {loading ? (
                <div className="space-y-6">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 animate-pulse">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                      <div className="flex space-x-2">
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : tips.length > 0 ? (
                <>
                  <div className="space-y-6">
                    {tips.map((tip) => (
                      <ResumeTipCard key={tip.tipId} tip={tip} />
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tips found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search criteria or filters to find more tips.
                  </p>
                  <button
                    onClick={() => handleFilterChange({
                      q: '',
                      category: '',
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
        ) : (
          <ResumeTemplates />
        )}
      </div>

      <Footer />
    </div>
  )
}

export default function ResumeTipsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
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
      <ResumeTipsContent />
    </Suspense>
  )
}