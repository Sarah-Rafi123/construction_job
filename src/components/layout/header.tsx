import Link from "next/link"
import { Briefcase } from "lucide-react"

export default function Header() {
  return (
    <header className="sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Briefcase className="h-6 w-6 text-[#D49F2E] mr-2" />
            <span className="text-xl font-bold text-black">Jay</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="px-4 py-2 text-[#D49F2E] font-medium border  border-[#D2D2D0] rounded-lg hover:bg-gray-50 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-[#D49F2E] text-white font-medium rounded-lg hover:bg-[#C48E1D] transition-colors"
            >
             Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
