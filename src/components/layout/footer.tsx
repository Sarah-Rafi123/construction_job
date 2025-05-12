import { Briefcase, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"
import Link from "next/link"
export default function Footer() {
  const socialLoginUrls = {
    facebook: "https://www.facebook.com/login",
    twitter: "https://twitter.com/i/flow/login",
    linkedin: "https://www.linkedin.com/login",
    instagram: "https://www.instagram.com/accounts/login",
  }
  const handleSocialLogin = (provider: string) => {
    window.location.href = socialLoginUrls[provider as keyof typeof socialLoginUrls]
  }
  return (
    <footer className="py-12 bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <Briefcase className="h-6 w-6 mr-2 text-[#F5A623]" />
              <span className="text-xl font-bold text-white">Jay Constructions</span>
            </div>
            <p className="text-gray-400 mb-4">
              The ultimate platform connecting contractors, sub-contractors, and skilled workers for successful
              construction projects.
            </p>
            <div className="flex space-x-4">
              <a   onClick={() => handleSocialLogin("facebook")} href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a  onClick={() => handleSocialLogin("twitter")} href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a  onClick={() => handleSocialLogin("linkedin")} href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a onClick={() => handleSocialLogin("instagram")} href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">About</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms-and-conditions" className="text-gray-400 hover:text-white transition-colors">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <a href="/contact-us" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Get job notifications</h4>
            <p className="text-gray-400 mb-4">The latest job news, articles, sent to your inbox weekly.</p>
            <form className="flex w-auto">
              <input
                type="email"
                placeholder="Email address"
                className="px-4 py-2 bg-gray-800 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#F5A623] border border-gray-700 flex-grow"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#F5A623] text-white font-medium rounded-r-lg hover:bg-[#E09613] transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} Jay Constructions. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
