"use client";
import { useState } from "react";
import JobSearch from "./job-search";
import JobGrid from "./job-grid";
import { sampleJobs } from "@/lib/sampleJobs";
const JobsSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("All Types");
  const [selectedServiceType, setSelectedServiceType] = useState("All Services");
  const [radiusFilter, setRadiusFilter] = useState<number[]>([0, 30]);

  return (
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

      <JobGrid jobs={sampleJobs} />
    </div>
  );
};

export default JobsSection;
