import Link from "next/link"
import { ArrowRight, Wrench } from "lucide-react"
import type { Category } from "@/types/jobTypes"

interface CategoriesSectionProps {
  categories: Category[]
}

export default function CategoriesSection({ categories }: CategoriesSectionProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Explore by category</h2>
          <Link href="/signup" className="flex items-center text-[#D49F2E] hover:underline font-medium">
            Show all jobs
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
            >
              <div className="flex justify-center mb-4">
                <Wrench className="h-10 w-10 text-[#D49F2E]" />
              </div>
              <h3 className="text-lg font-semibold text-black text-center mb-2">{category.title}</h3>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{category.jobsAvailable} jobs available</span>
                <ArrowRight className="h-4 w-4 text-[#D49F2E]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
