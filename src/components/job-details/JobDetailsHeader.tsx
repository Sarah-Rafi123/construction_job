import { MapPin, Briefcase, DollarSign, Calendar } from "lucide-react"

interface JobDetailsHeaderProps {
  job: any
  formattedDate: string
  avatarText: string
}

export default function JobDetailsHeader({ job, formattedDate, avatarText }: JobDetailsHeaderProps) {
  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-[#D49F2E] text-white flex items-center justify-center font-bold text-lg mr-4">
          {avatarText}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{job.job_title}</h1>
          <p className="text-gray-600">
            {job.target_user === "subcontractor" ? "For Subcontractors" : "For Job Seekers"}
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center">
          <MapPin className="h-5 w-5 text-[#D49F2E] mr-3" />
          <span className="text-gray-600">
            {job.job_location
              ? `${job.job_location.coordinates[1]}, ${job.job_location.coordinates[0]}`
              : "Location not specified"}
          </span>
        </div>

        <div className="flex items-center">
          <Briefcase className="h-5 w-5 text-[#D49F2E] mr-3" />
          <span className="text-gray-600">{job.job_type}</span>
        </div>

        <div className="flex items-center">
          <DollarSign className="h-5 w-5 text-[#D49F2E] mr-3" />
          <span className="text-gray-600">{job.budget ? `$${job.budget}` : "Budget not specified"}</span>
        </div>

        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-[#D49F2E] mr-3" />
          <span className="text-gray-600">Posted on {formattedDate}</span>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h3 className="font-semibold text-gray-800 mb-2">Services Required:</h3>
        <div className="flex flex-wrap gap-2">
          {job.services && Array.isArray(job.services) && job.services.length > 0 ? (
            job.services.map((service: any, index: number) => (
              <span
                key={service._id || index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[rgba(212,159,46,0.1)] text-[#D49F2E]"
              >
                {service.service_name}
                {service.resource_count > 0 ? ` (${service.resource_count})` : ""}
              </span>
            ))
          ) : (
            <span className="text-gray-500 italic">No services specified</span>
          )}
        </div>
      </div>

      {job.job_priority && (
        <div className="mt-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800 font-semibold">
            Priority
          </span>
        </div>
      )}
    </div>
  )
}
