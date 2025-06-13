'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  MapPinIcon, 
  CurrencyDollarIcon, 
  CalendarIcon,
  BookmarkIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid'

interface Job {
  jobId: string
  role: string
  companyName: string
  companyLogo: string
  location: string
  salary: string
  postedOn: string
  tags: string[]
  category: string
  jobDescription: string
}

interface JobCardProps {
  job: Job
}

export default function JobCard({ job }: JobCardProps) {
  const [saved, setSaved] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]')
      return savedJobs.includes(job.jobId)
    }
    return false
  })

  const toggleSave = () => {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]')
    let newSavedJobs
    
    if (saved) {
      newSavedJobs = savedJobs.filter((id: string) => id !== job.jobId)
    } else {
      newSavedJobs = [...savedJobs, job.jobId]
    }
    
    localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs))
    setSaved(!saved)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return `${Math.ceil(diffDays / 30)} months ago`
  }

  const truncateDescription = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-primary-200 transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
            {job.companyLogo ? (
              <Image
                src={job.companyLogo}
                alt={`${job.companyName} logo`}
                width={56}
                height={56}
                className="object-cover"
              />
            ) : (
              <span className="text-lg font-semibold text-gray-600">
                {job.companyName.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg group-hover:text-primary-600 transition-colors">
              {job.role}
            </h3>
            <p className="text-gray-600 font-medium">{job.companyName}</p>
            <p className="text-sm text-gray-500">{job.category}</p>
          </div>
        </div>
        
        <button
          onClick={toggleSave}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          title={saved ? 'Remove from saved' : 'Save job'}
        >
          {saved ? (
            <BookmarkSolidIcon className="h-6 w-6 text-primary-600" />
          ) : (
            <BookmarkIcon className="h-6 w-6 text-gray-400" />
          )}
        </button>
      </div>

      {/* Job Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="truncate">{job.location}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <CurrencyDollarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="truncate">{job.salary}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="truncate">{formatDate(job.postedOn)}</span>
        </div>
      </div>

      {/* Job Description */}
      {job.jobDescription && (
        <div className="mb-4">
          <p className="text-gray-700 text-sm leading-relaxed">
            {truncateDescription(job.jobDescription)}
          </p>
        </div>
      )}

      {/* Tags */}
      {job.tags && job.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {job.tags.slice(0, 4).map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full"
            >
              {tag}
            </span>
          ))}
          {job.tags.length > 4 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
              +{job.tags.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Link
          href={`/jobs/${job.jobId}`}
          className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <EyeIcon className="h-4 w-4 mr-2" />
          View Details
        </Link>
        
        <div className="text-xs text-gray-500">
          Job ID: {job.jobId.slice(-8)}
        </div>
      </div>
    </div>
  )
}