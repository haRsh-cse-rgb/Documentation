'use client'

import { 
  StarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ExternalLinkIcon,
  UserGroupIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

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

interface CertificationCardProps {
  certification: Certification
}

export default function CertificationCard({ certification }: CertificationCardProps) {
  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarSolidIcon key={i} className="h-4 w-4 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(<StarIcon key="half" className="h-4 w-4 text-yellow-400" />)
    }

    const remainingStars = 5 - Math.ceil(rating)
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<StarIcon key={`empty-${i}`} className="h-4 w-4 text-gray-300" />)
    }

    return stars
  }

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-orange-100 text-orange-800'
      case 'expert':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-primary-200 transition-all duration-300">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2">
            {certification.title}
          </h3>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(certification.level)}`}>
            {certification.level}
          </span>
        </div>
        
        <p className="text-gray-600 font-medium mb-1">{certification.provider}</p>
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
          {certification.category}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm mb-4 line-clamp-3">
        {certification.description}
      </p>

      {/* Rating and Enrollment */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-1">
          {renderStars(certification.rating)}
          <span className="text-sm text-gray-600 ml-2">
            {certification.rating.toFixed(1)}
          </span>
        </div>
        
        {certification.enrollmentCount > 0 && (
          <div className="flex items-center text-sm text-gray-600">
            <UserGroupIcon className="h-4 w-4 mr-1" />
            <span>{certification.enrollmentCount.toLocaleString()} enrolled</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <ClockIcon className="h-4 w-4 mr-2" />
          <span>{certification.duration}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <CurrencyDollarIcon className="h-4 w-4 mr-2" />
          <span>{certification.cost}</span>
        </div>
      </div>

      {/* Prerequisites */}
      {certification.prerequisites && certification.prerequisites.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Prerequisites:</p>
          <div className="flex flex-wrap gap-1">
            {certification.prerequisites.slice(0, 3).map((prereq, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {prereq}
              </span>
            ))}
            {certification.prerequisites.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{certification.prerequisites.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action */}
      <div className="flex items-center justify-between">
        <a
          href={certification.certificationLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <AcademicCapIcon className="h-4 w-4 mr-2" />
          Enroll Now
          <ExternalLinkIcon className="h-4 w-4 ml-2" />
        </a>
        
        <div className="text-xs text-gray-500">
          ID: {certification.certificationId.slice(-8)}
        </div>
      </div>
    </div>
  )
}