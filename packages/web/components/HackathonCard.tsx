'use client'

import Link from 'next/link'
import { 
  CalendarIcon, 
  ClockIcon,
  CurrencyDollarIcon,
  ExternalLinkIcon,
  CodeBracketIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

interface Hackathon {
  hackathonId: string
  title: string
  description: string
  organizer: string
  category: string
  registrationDeadline: string
  eventDate: string
  duration: string
  prizePool: string
  registrationLink: string
  githubRepo?: string
  resources?: string[]
  status: string
  tags: string[]
}

interface HackathonCardProps {
  hackathon: Hackathon
}

export default function HackathonCard({ hackathon }: HackathonCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'ongoing':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Open for Registration'
      case 'ongoing':
        return 'Ongoing'
      case 'completed':
        return 'Completed'
      default:
        return status
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-primary-200 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
            {hackathon.title}
          </h3>
          <p className="text-gray-600 font-medium mb-1">{hackathon.organizer}</p>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
            {hackathon.category}
          </span>
        </div>
        
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(hackathon.status)}`}>
          {getStatusLabel(hackathon.status)}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm mb-4 line-clamp-3">
        {hackathon.description}
      </p>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <CalendarIcon className="h-4 w-4 mr-2" />
          <span>Registration: {formatDate(hackathon.registrationDeadline)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <CalendarIcon className="h-4 w-4 mr-2" />
          <span>Event: {formatDate(hackathon.eventDate)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <ClockIcon className="h-4 w-4 mr-2" />
          <span>Duration: {hackathon.duration}</span>
        </div>
        {hackathon.prizePool && (
          <div className="flex items-center text-sm text-gray-600">
            <CurrencyDollarIcon className="h-4 w-4 mr-2" />
            <span>Prize: {hackathon.prizePool}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {hackathon.tags && hackathon.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {hackathon.tags.slice(0, 4).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {hackathon.tags.length > 4 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{hackathon.tags.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-3">
          {hackathon.registrationLink && (
            <a
              href={hackathon.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Register
              <ExternalLinkIcon className="h-4 w-4 ml-2" />
            </a>
          )}
          
          {hackathon.githubRepo && (
            <a
              href={hackathon.githubRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <CodeBracketIcon className="h-4 w-4 mr-2" />
              GitHub
            </a>
          )}
        </div>
        
        <div className="text-xs text-gray-500">
          ID: {hackathon.hackathonId.slice(-8)}
        </div>
      </div>

      {/* Resources */}
      {hackathon.resources && hackathon.resources.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <DocumentTextIcon className="h-4 w-4 mr-2" />
            <span className="font-medium">Resources:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {hackathon.resources.map((resource, index) => (
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
          </div>
        </div>
      )}
    </div>
  )
}