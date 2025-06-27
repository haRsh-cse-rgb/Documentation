'use client'

import { useState, useEffect } from 'react'
import { 
  DocumentTextIcon,
  DownloadIcon,
  EyeIcon,
  StarIcon
} from '@heroicons/react/24/outline'

interface ResumeTemplate {
  tipId: string
  title: string
  content: string
  category: string
  level: string
  tags: string[]
  priority: number
  templateUrl?: string
  previewUrl?: string
  downloadUrl?: string
  status: string
}

export default function ResumeTemplates() {
  const [templates, setTemplates] = useState<ResumeTemplate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resume-tips/templates`)
      const data = await response.json()
      setTemplates(data.templates || [])
    } catch (error) {
      console.error('Error fetching resume templates:', error)
      setTemplates([])
    } finally {
      setLoading(false)
    }
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

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl p-6 animate-pulse">
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="flex space-x-2">
              <div className="h-8 bg-gray-200 rounded w-20"></div>
              <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No templates available</h3>
        <p className="text-gray-600">
          Resume templates will be available soon. Check back later!
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <div
          key={template.tipId}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-primary-200 transition-all duration-300"
        >
          {/* Template Preview */}
          <div className="mb-4">
            {template.previewUrl ? (
              <img
                src={template.previewUrl}
                alt={template.title}
                className="w-full h-32 object-cover rounded-lg bg-gray-100"
              />
            ) : (
              <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <DocumentTextIcon className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>

          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {template.title}
              </h3>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(template.level)}`}>
                {template.level}
              </span>
            </div>
            
            {template.priority > 0 && (
              <div className="flex items-center space-x-1">
                {getPriorityStars(template.priority)}
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-700 text-sm mb-4 line-clamp-3">
            {template.content}
          </p>

          {/* Tags */}
          {template.tags && template.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {template.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {template.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{template.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-2">
            {template.previewUrl && (
              <a
                href={template.previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
              >
                <EyeIcon className="h-4 w-4 mr-2" />
                Preview
              </a>
            )}
            
            {template.downloadUrl ? (
              <a
                href={template.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download
              </a>
            ) : (
              <button
                disabled
                className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gray-300 text-gray-500 font-medium rounded-lg cursor-not-allowed"
              >
                <DownloadIcon className="h-4 w-4 mr-2" />
                Coming Soon
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}