'use client'

import { 
  TagIcon,
  CalendarIcon,
  StarIcon
} from '@heroicons/react/24/outline'

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

interface ResumeTipCardProps {
  tip: ResumeTip
}

export default function ResumeTipCard({ tip }: ResumeTipCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Writing': 'bg-blue-100 text-blue-800',
      'Formatting': 'bg-green-100 text-green-800',
      'Content': 'bg-purple-100 text-purple-800',
      'Keywords': 'bg-yellow-100 text-yellow-800',
      'ATS Optimization': 'bg-red-100 text-red-800',
      'Industry Specific': 'bg-indigo-100 text-indigo-800',
      'Experience Level': 'bg-pink-100 text-pink-800',
      'Skills Section': 'bg-teal-100 text-teal-800',
      'Education': 'bg-orange-100 text-orange-800',
      'Projects': 'bg-cyan-100 text-cyan-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const getLevelColor = (level: string) => {
    const colors: { [key: string]: string } = {
      'Entry Level': 'bg-green-100 text-green-800',
      'Mid Level': 'bg-yellow-100 text-yellow-800',
      'Senior Level': 'bg-orange-100 text-orange-800',
      'Executive': 'bg-red-100 text-red-800',
      'All Levels': 'bg-blue-100 text-blue-800'
    }
    return colors[level] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityStars = (priority: number) => {
    const stars = []
    for (let i = 0; i < Math.min(priority, 5); i++) {
      stars.push(<StarIcon key={i} className="h-4 w-4 text-yellow-400 fill-current" />)
    }
    return stars
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-primary-200 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
            {tip.title}
          </h3>
          <div className="flex items-center space-x-3 mb-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(tip.category)}`}>
              {tip.category}
            </span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(tip.level)}`}>
              {tip.level}
            </span>
          </div>
        </div>
        
        {tip.priority > 0 && (
          <div className="flex items-center space-x-1">
            {getPriorityStars(tip.priority)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
          {tip.content}
        </p>
      </div>

      {/* Tags */}
      {tip.tags && tip.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <TagIcon className="h-4 w-4 text-gray-400 mt-1" />
          {tip.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center">
          <CalendarIcon className="h-4 w-4 mr-1" />
          <span>Added {formatDate(tip.createdAt)}</span>
        </div>
        
        <div className="text-xs">
          ID: {tip.tipId.slice(-8)}
        </div>
      </div>
    </div>
  )
}