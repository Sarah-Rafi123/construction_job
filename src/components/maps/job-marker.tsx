"use client";

import { useState } from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";
import type { Job } from "@/types/jobTypes";
import { useRouter } from "next/navigation";

interface JobMarkerProps {
  job: Job;
  position: google.maps.LatLngLiteral;
}

export default function JobMarker({ job, position }: JobMarkerProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const getMarkerColor = () => {
    if (job.target_user === "subcontractor") {
      return "#D49F2E" // amber color for subcontractor jobs
    } else if (job.job_type === "apprentice") {
      return "#2563EB" // blue for apprentice
    } else if (job.job_type === "graduate") {
      return "#10B981" // green for graduate
    } else if (job.job_type === "fixed") {
      return "#8B5CF6" // purple for fixed
    } else if (job.job_type === "permanent") {
      return "#EC4899" // pink for permanent
    } else {
      return "#6366F1" // indigo for other types
    }
  }

  // SVG marker with dynamic color
  const svgMarker = {
    path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
    fillColor: getMarkerColor(),
    fillOpacity: 1,
    strokeWeight: 1,
    strokeColor: "#FFFFFF",
    rotation: 0,
    scale: 2,
    anchor:
      typeof window !== "undefined" && window.google
        ? new window.google.maps.Point(12, 22)
        : undefined,
  };

  return (
    <>
      <Marker
        position={position}
        onClick={() => setIsOpen(true)}
        icon={svgMarker}
      />

      {isOpen && (
        <InfoWindow position={position} onCloseClick={() => setIsOpen(false)}>
          <div className="p-2 max-w-[220px]">
            <h3 className="font-semibold text-sm">{job.job_title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: getMarkerColor() }}
              ></span>
              <p className="text-xs text-gray-600">{job.job_type}</p>
            </div>
            {job.target_user && (
              <p className="text-xs text-gray-500 mt-1">
                For:{" "}
                {job.target_user.charAt(0).toUpperCase() +
                  job.target_user.slice(1)}
              </p>
            )}
            <button
              className="mt-2 text-xs bg-[#D49F2E] text-white px-3 py-1 rounded-md font-medium hover:bg-amber-600 transition-colors"
              onClick={() => router.push(`/jobs/${job._id}`)}
            >
              View Details
            </button>
          </div>
        </InfoWindow>
      )}
    </>
  );
}
