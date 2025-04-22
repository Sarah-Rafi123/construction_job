interface DashboardCardsProps {
    userType: string | null
  }
  
  export default function DashboardCards({ userType }: DashboardCardsProps) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Profile</h3>
          <p className="text-gray-600 text-sm">View and update your profile information</p>
        </div>
  
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {userType === "job-seeker" ? "Job Listings" : "Projects"}
          </h3>
          <p className="text-gray-600 text-sm">
            {userType === "job-seeker"
              ? "Browse available job opportunities"
              : "Manage your current and upcoming projects"}
          </p>
        </div>
  
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Messages</h3>
          <p className="text-gray-600 text-sm">Check your messages and notifications</p>
        </div>
      </div>
    )
  }
  