"use client"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import HeroSection from "@/components/landingpage-components/hero-section"
import CategoriesSection from "@/components/landingpage-components/categories-section"
import ContractorsSection from "@/components/landingpage-components/contractors-section"
import SubcontractorsSection from "@/components/landingpage-components/subcontractors-section"
import JobSeekersSection from "@/components/landingpage-components/job-seekers-section"
import FeaturedJobsSection from "@/components/landingpage-components/featured-jobs-section"
import CTASection from "@/components/landingpage-components/cta-section"
import { serviceCategories, featuredJobs, companies } from "@/lib/data/placeholderData"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection companies={companies} />
      <CategoriesSection categories={serviceCategories} />
      <ContractorsSection />
      <SubcontractorsSection />
      <JobSeekersSection />
      <FeaturedJobsSection jobs={featuredJobs} />
      <CTASection />
      <Footer />
    </div>
  )
}
