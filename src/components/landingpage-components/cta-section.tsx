import Link from "next/link"

export default function CTASection() {
  return (
    <section className="py-16 bg-indigo-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Start posting jobs today</h3>
            <p className="text-gray-600">Start posting jobs for only $0</p>
          </div>
          <Link
            href="/signup"
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg whitespace-nowrap hover:bg-indigo-700 transition-colors"
          >
            Sign Up For Free
          </Link>
        </div>
      </div>
    </section>
  )
}
