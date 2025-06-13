'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  CodeBracketIcon, 
  ChartBarIcon, 
  PaintBrushIcon, 
  MegaphoneIcon,
  CogIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'

const categories = [
  {
    name: 'Software Development',
    slug: 'software',
    icon: CodeBracketIcon,
    count: '2.5K+ jobs',
    color: 'bg-blue-500',
    description: 'Frontend, Backend, Full-stack, Mobile'
  },
  {
    name: 'Data Science',
    slug: 'data-science',
    icon: ChartBarIcon,
    count: '1.2K+ jobs',
    color: 'bg-green-500',
    description: 'Analytics, ML, AI, Big Data'
  },
  {
    name: 'Design',
    slug: 'design',
    icon: PaintBrushIcon,
    count: '800+ jobs',
    color: 'bg-purple-500',
    description: 'UI/UX, Graphic, Product Design'
  },
  {
    name: 'Marketing',
    slug: 'marketing',
    icon: MegaphoneIcon,
    count: '950+ jobs',
    color: 'bg-pink-500',
    description: 'Digital, Content, Growth Marketing'
  },
  {
    name: 'DevOps',
    slug: 'devops',
    icon: CogIcon,
    count: '600+ jobs',
    color: 'bg-orange-500',
    description: 'Cloud, Infrastructure, Automation'
  },
  {
    name: 'Human Resources',
    slug: 'hr',
    icon: UserGroupIcon,
    count: '400+ jobs',
    color: 'bg-teal-500',
    description: 'Recruitment, People Ops, Training'
  },
  {
    name: 'Sales',
    slug: 'sales',
    icon: CurrencyDollarIcon,
    count: '700+ jobs',
    color: 'bg-yellow-500',
    description: 'Business Development, Account Management'
  },
  {
    name: 'Education',
    slug: 'education',
    icon: AcademicCapIcon,
    count: '300+ jobs',
    color: 'bg-indigo-500',
    description: 'Teaching, Training, Curriculum'
  }
]

export default function JobCategories() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Browse Jobs by Category
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Find opportunities in your field of expertise
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={`/jobs?category=${category.slug}`}>
                <div className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-primary-200 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center mb-4">
                    <div className={`${category.color} p-3 rounded-lg text-white group-hover:scale-110 transition-transform duration-300`}>
                      <category.icon className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500">{category.count}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <Link 
            href="/jobs" 
            className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            View All Jobs
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}