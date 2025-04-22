"use client"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import HeroSection from "@/components/landingpage-components/hero-section"
import ContractorsSection from "@/components/landingpage-components/contractors-section"
import SubcontractorsSection from "@/components/landingpage-components/subcontractors-section"
import JobSeekersSection from "@/components/landingpage-components/job-seekers-section"
import FeaturedJobsSection from "@/components/landingpage-components/featured-jobs-section"
import { featuredJobs, companies } from "@/lib/data/placeholderData"
import BackgroundDesign from "@/components/layout/background-design"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white relative">
      <BackgroundDesign />
      <div className="relative z-10">
        <Header />
        <HeroSection companies={companies} />
        <FeaturedJobsSection jobs={featuredJobs} />
        <JobSeekersSection />
        <ContractorsSection />
        <SubcontractorsSection />
        <Footer />
      </div> 
    </div>
  )
}
