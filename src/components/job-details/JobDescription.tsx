interface JobDescriptionProps {
  job: any
}

export default function JobDescription({ job }: JobDescriptionProps) {
  return (
    <div className="p-6">
      <h2 className="text-xl text-black font-semibold mb-4">Job Description</h2>
      <p className="text-gray-700 whitespace-pre-line">
        {job.job_description || "No description provided for this job."}
        {!job.job_description && (
          <>
            <br />
            <br />
            This is a {job.job_type} position
            {job.target_user === "subcontractor" ? " for subcontractors" : " for individual job seekers"}.
            {job.services && Array.isArray(job.services) && job.services.length > 0 && (
              <>
                <br />
                <br />
                We are looking for professionals with expertise in{" "}
                {job.services.map((s: any) => s.service_name).join(", ")}.
              </>
            )}
          </>
        )}
      </p>
    </div>
  )
}
