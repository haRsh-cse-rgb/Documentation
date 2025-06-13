import Hero from '@/components/Hero'
import FeaturedJobs from '@/components/FeaturedJobs'
import JobCategories from '@/components/JobCategories'
import Newsletter from '@/components/Newsletter'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <JobCategories />
      <FeaturedJobs />
      <Newsletter />
      <Footer />
    </main>
  )
}