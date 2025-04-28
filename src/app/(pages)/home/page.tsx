"use client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import MainSection from "@/components/home-components/main-section";
import DashboardCards from "@/components/home-components/dashboard-cards";
import JobSearch from "@/components/home-components/job-search";
import JobGrid from "@/components/home-components/job-grid";
import ApprovalAlert from "@/components/home-components/approval-alert";
import ProtectedRoute from "@/components/global/ProtectedRoute";
import { useSelector } from "react-redux";
import JobsSection from "@/components/home-components/JobsSection";
import useGetCurrentLocation from "../../../../hooks/useGetCurrentLocation";

export default function Home() {
  const router = useRouter();
  useGetCurrentLocation();
  const currentUser = useSelector((state: any) => state.user?.currentUser || "");
  const currentUserlocation = useSelector((state: any) => state.user?.currentUserLocation || "");
  console.log("current user is", currentUser);
  console.log("current user location is", currentUserlocation);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <MainSection userType={currentUser.role} />

        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">Welcome to Your Dashboard</h1>

            {currentUser.role == "main_contractor" && (
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Let's Post a Job
              </button>
            )}
          </div>

          {/* {needsApproval && <ApprovalAlert />} */}

          {/* <DashboardCards userType={userType} /> */}
          <JobsSection />

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              You've successfully logged in as a{" "}
              {currentUser.role
                ?.split("-")
                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
              .
            </p>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
