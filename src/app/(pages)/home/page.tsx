"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sampleJobs } from "@/lib/data/sampledata";
import Navbar from "@/components/layout/navbar";
import MainSection from "@/components/home-components/main-section";
import DashboardCards from "@/components/home-components/dashboard-cards";
import JobSearch from "@/components/home-components/job-search";
import JobGrid from "@/components/home-components/job-grid";
import ApprovalAlert from "@/components/home-components/approval-alert";
import ProtectedRoute from "@/components/global/ProtectedRoute";
import { useSelector } from "react-redux";
export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("All Types");
  const [selectedServiceType, setSelectedServiceType] = useState("All Services");
  const [radiusFilter, setRadiusFilter] = useState<number[]>([0, 30]);
  const [filteredJobs, setFilteredJobs] = useState(sampleJobs);
  const [sortBy, setSortBy] = useState("newest");
  const currentUser = useSelector((state: any) => state.user?.currentUser || "");
  console.log("current user is", currentUser);
  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");

    if (storedUserType) {
      setUserType(storedUserType);
      setIsLoggedIn(true);
    } else {
      router.push("/login");
    }

    setLoading(false);
  }, [router]);

  useEffect(() => {
    let results = sampleJobs;
    if (searchTerm) {
      results = results.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedJobType !== "All Types") {
      results = results.filter((job) => job.type === selectedJobType);
    }
    if (selectedServiceType !== "All Services") {
      results = results.filter((job) => job.services.includes(selectedServiceType));
    }

    results = results.filter((job) => job.radius >= radiusFilter[0] && job.radius <= radiusFilter[1]);

    if (sortBy === "newest") {
      // Already sorted by newest
    } else if (sortBy === "budget-high") {
      results = results.sort((a, b) => {
        if (a.budget === "Negotiable") return 1;
        if (b.budget === "Negotiable") return -1;

        const aMax = Number.parseInt(a.budget.split(" - ")[1]?.replace(/\D/g, "") || a.budget.replace(/\D/g, ""));
        const bMax = Number.parseInt(b.budget.split(" - ")[1]?.replace(/\D/g, "") || b.budget.replace(/\D/g, ""));

        return bMax - aMax;
      });
    } else if (sortBy === "budget-low") {
      results = results.sort((a, b) => {
        if (a.budget === "Negotiable") return 1;
        if (b.budget === "Negotiable") return -1;

        const aMin = Number.parseInt(a.budget.split(" - ")[0]?.replace(/\D/g, "") || a.budget.replace(/\D/g, ""));
        const bMin = Number.parseInt(b.budget.split(" - ")[0]?.replace(/\D/g, "") || b.budget.replace(/\D/g, ""));

        return aMin - bMin;
      });
    }

    setFilteredJobs(results);
  }, [searchTerm, selectedJobType, selectedServiceType, radiusFilter, sortBy]);

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem("userType");
    setIsLoggedIn(false);
    router.push("/login");
  };

  const handlePostJob = () => {
    router.push("/post-job");
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }
  const needsApproval = userType === "main-contractor" || userType === "sub-contractor";
  const isContractor = userType === "main-contractor" || userType === "sub-contractor";

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <MainSection userType={currentUser.role} />

        <main className="container mx-auto px-4 py-8 max-w-7xl">
          {/* <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">Welcome to Your Dashboard</h1>

          {isContractor && (
            <button
              onClick={handlePostJob}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center font-medium"
            >
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
        </div> */}

          {/* {needsApproval && <ApprovalAlert />} */}

          {/* <DashboardCards userType={userType} /> */}

          <div className="mt-12 mb-8 bg-white p-6 rounded-xl shadow-sm">
            <JobSearch
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedJobType={selectedJobType}
              setSelectedJobType={setSelectedJobType}
              selectedServiceType={selectedServiceType}
              setSelectedServiceType={setSelectedServiceType}
              radiusFilter={radiusFilter}
              setRadiusFilter={setRadiusFilter}
            />

            <JobGrid jobs={filteredJobs} router={router} />
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              You've successfully logged in as a{" "}
              {userType
                ?.split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
              .
            </p>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
