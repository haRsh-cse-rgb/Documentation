'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isResourcesOpen, setIsResourcesOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/jobs?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  const resourcesLinks = [
    { href: '/hackathons', label: 'Hackathons' },
    { href: '/certifications', label: 'Certifications' },
    { href: '/courses', label: 'Courses' },
    { href: '/resume-tips', label: 'Resume Tips' },
  ]

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">J</span>
            </div>
            <span className="text-xl font-bold text-gray-900">JobQuest</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/jobs" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Jobs
            </Link>
            <Link href="/sarkari-jobs" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Sarkari Jobs
            </Link>
            <Link href="/sarkari-results" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Results
            </Link>
            
            {/* Resources Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                className="flex items-center text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                Resources
                <ChevronDownIcon className={`ml-1 h-4 w-4 transition-transform ${isResourcesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isResourcesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                  >
                    {resourcesLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                        onClick={() => setIsResourcesOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center max-w-md w-full mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </form>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {isOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </form>

              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                <Link
                  href="/jobs"
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Jobs
                </Link>
                <Link
                  href="/sarkari-jobs"
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Sarkari Jobs
                </Link>
                <Link
                  href="/sarkari-results"
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Results
                </Link>
                
                {/* Mobile Resources */}
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <p className="px-3 py-1 text-sm font-medium text-gray-500">Resources</p>
                  {resourcesLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}