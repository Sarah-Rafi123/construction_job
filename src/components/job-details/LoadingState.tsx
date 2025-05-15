import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"

export default function LoadingState() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#D49F2E] mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading job details...</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
