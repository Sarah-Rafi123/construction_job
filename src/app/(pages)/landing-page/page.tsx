"use client";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/landingpage-components/hero-section";
import ContractorsSection from "@/components/landingpage-components/contractors-section";
import SubcontractorsSection from "@/components/landingpage-components/subcontractors-section";
import JobSeekersSection from "@/components/landingpage-components/job-seekers-section";
import FeaturedJobsSection from "@/components/landingpage-components/featured-jobs-section";
import { featuredJobs, companies } from "@/lib/data/placeholderData";
import BackgroundDesign from "@/components/layout/background-design";
import Navbar from "@/components/layout/navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen  bg-white relative">
      <BackgroundDesign />
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      <div className="max-w-7xl mx-auto px-4 ">
      <div className="pt-[80px] z-10">
        <HeroSection companies={companies} />
        <FeaturedJobsSection jobs={featuredJobs} />
        <JobSeekersSection />
        <ContractorsSection />
        <SubcontractorsSection />    
      </div>
      </div>
      <Footer />
    </div>
  );
}
