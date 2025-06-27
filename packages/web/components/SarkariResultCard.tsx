'use client'

import Link from 'next/link'
import { 
  CalendarIcon, 
  DocumentTextIcon,
  ExternalLinkIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'

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

interface SarkariResultCardProps {
  result: SarkariResult
}

export default function SarkariResultCard({ result }: SarkariResultCardProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-primary-200 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
            {result.postName}
          </h3>
          <div className="flex items-center text-gray-600 mb-2">
            <BuildingOfficeIcon className="h-4 w-4 mr-2" />
            <span className="font-medium">{result.organization}</span>
          </div>
          {result.advertisementNo && (
            <p className="text-sm text-gray-500">
              Advertisement No: {result.advertisementNo}
            </p>
          )}
        </div>
        
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Result Out
        </span>
      </div>

      {/* Important Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {result.importantDates?.examDate && (
          <div className="flex items-center text-sm text-gray-600">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <span>Exam Date: {formatDate(result.importantDates.examDate)}</span>
          </div>
        )}
        {result.importantDates?.resultDate && (
          <div className="flex items-center text-sm text-gray-600">
            <DocumentTextIcon className="h-4 w-4 mr-2" />
            <span>Result Date: {formatDate(result.importantDates.resultDate)}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        {result.resultLink ? (
          <a
            href={result.resultLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <DocumentTextIcon className="h-4 w-4 mr-2" />
            View Result
            <ExternalLinkIcon className="h-4 w-4 ml-2" />
          </a>
        ) : (
          <span className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-500 font-medium rounded-lg">
            Result Link Not Available
          </span>
        )}
        
        <div className="text-xs text-gray-500">
          ID: {result.jobId.slice(-8)}
        </div>
      </div>
    </div>
  )
}