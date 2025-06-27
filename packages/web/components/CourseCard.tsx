'use client'

import { 
  StarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ExternalLinkIcon,
  UserGroupIcon,
  BookOpenIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

interface Course {
  courseId: string
  title: string
  description: string
  provider: string
  category: string
  level: string
  courseType: string
  duration: string
  cost: string
  rating: number
  enrollmentCount: number
  courseLink: string
  syllabus?: string[]
  prerequisites?: string[]
  resources?: string[]
  status: string
}

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
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
      case 'all levels':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video course':
        return 'bg-purple-100 text-purple-800'
      case 'interactive':
        return 'bg-blue-100 text-blue-800'
      case 'project-based':
        return 'bg-green-100 text-green-800'
      case 'bootcamp':
        return 'bg-red-100 text-red-800'
      case 'specialization':
        return 'bg-indigo-100 text-indigo-800'
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
            {course.title}
          </h3>
          <div className="flex flex-col gap-1">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
              {course.level}
            </span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(course.courseType)}`}>
              {course.courseType}
            </span>
          </div>
        </div>
        
        <p className="text-gray-600 font-medium mb-1">{course.provider}</p>
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
          {course.category}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm mb-4 line-clamp-3">
        {course.description}
      </p>

      {/* Rating and Enrollment */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-1">
          {renderStars(course.rating)}
          <span className="text-sm text-gray-600 ml-2">
            {course.rating.toFixed(1)}
          </span>
        </div>
        
        {course.enrollmentCount > 0 && (
          <div className="flex items-center text-sm text-gray-600">
            <UserGroupIcon className="h-4 w-4 mr-1" />
            <span>{course.enrollmentCount.toLocaleString()} enrolled</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <ClockIcon className="h-4 w-4 mr-2" />
          <span>{course.duration}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <CurrencyDollarIcon className="h-4 w-4 mr-2" />
          <span>{course.cost}</span>
        </div>
      </div>

      {/* Prerequisites */}
      {course.prerequisites && course.prerequisites.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Prerequisites:</p>
          <div className="flex flex-wrap gap-1">
            {course.prerequisites.slice(0, 2).map((prereq, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {prereq}
              </span>
            ))}
            {course.prerequisites.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{course.prerequisites.length - 2} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action */}
      <div className="flex items-center justify-between">
        <a
          href={course.courseLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <BookOpenIcon className="h-4 w-4 mr-2" />
          Start Course
          <ExternalLinkIcon className="h-4 w-4 ml-2" />
        </a>
        
        <div className="text-xs text-gray-500">
          ID: {course.courseId.slice(-8)}
        </div>
      </div>

      {/* Resources */}
      {course.resources && course.resources.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <DocumentTextIcon className="h-4 w-4 mr-2" />
            <span className="font-medium">Resources:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {course.resources.slice(0, 3).map((resource, index) => (
              <a
                key={index}
                href={resource}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary-600 hover:text-primary-700 underline"
              >
                Resource {index + 1}
              </a>
            ))}
            {course.resources.length > 3 && (
              <span className="text-xs text-gray-500">
                +{course.resources.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}