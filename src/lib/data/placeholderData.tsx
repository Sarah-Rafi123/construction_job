// Sample service categories
export const serviceCategories = [
    {
      title: "Electrical",
      icon: "Wrench",
      jobsAvailable: 235,
    },
    {
      title: "Plumbing",
      icon: "Wrench",
      jobsAvailable: 194,
    },
    {
      title: "Carpentry",
      icon: "Wrench",
      jobsAvailable: 160,
    },
    {
      title: "Painting",
      icon: "Wrench",
      jobsAvailable: 225,
    },
    {
      title: "HVAC",
      icon: "Wrench",
      jobsAvailable: 142,
    },
    {
      title: "Masonry",
      icon: "Wrench",
      jobsAvailable: 118,
    },
    {
      title: "Roofing",
      icon: "Wrench",
      jobsAvailable: 211,
    },
    {
      title: "Landscaping",
      icon: "Wrench",
      jobsAvailable: 185,
    },
  ]
  
  // Sample featured jobs
  export const featuredJobs = [
    {
      title: "Residential Electrician",
      company: "PowerTech Solutions",
      location: "New York, NY",
      type: "Full Time",
      logo: "/placeholder.svg?height=50&width=50",
    },
    {
      title: "Plumbing Contractor",
      company: "FlowMasters Inc",
      location: "Los Angeles, CA",
      type: "Contract",
      logo: "/placeholder.svg?height=50&width=50",
    },
    {
      title: "Kitchen Renovation",
      company: "HomeReno Experts",
      location: "Chicago, IL",
      type: "Project-based",
      logo: "/placeholder.svg?height=50&width=50",
    },
    {
      title: "Commercial Painting",
      company: "ColorPro Services",
      location: "Houston, TX",
      type: "Contract",
      logo: "/placeholder.svg?height=50&width=50",
    },
  ]
  
  // Sample companies
  export const companies = [
    "/placeholder.svg?height=40&width=120",
    "/placeholder.svg?height=40&width=120",
    "/placeholder.svg?height=40&width=120",
    "/placeholder.svg?height=40&width=120",
    "/placeholder.svg?height=40&width=120",
  ]
  
  // Define types for better type safety
  export interface Category {
    title: string
    icon: string
    jobsAvailable: number
  }
  
  export interface Job {
    title: string
    company: string
    location: string
    type: string
    logo: string
  }
  