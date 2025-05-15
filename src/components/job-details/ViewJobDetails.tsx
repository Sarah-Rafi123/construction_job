import JobDetailsHeader from "./JobDetailsHeader"
import JobDescription from "./JobDescription"
import ActionButtons from "./ActionButtons"

interface ViewJobDetailsProps {
  job: any
  formattedDate: string
  avatarText: string
  handleGoBack: () => void
  setIsEditing: (value: boolean) => void
  setShowDeleteConfirm: (value: boolean) => void
}

export default function ViewJobDetails({
  job,
  formattedDate,
  avatarText,
  handleGoBack,
  setIsEditing,
  setShowDeleteConfirm,
}: ViewJobDetailsProps) {
  return (
    <>
      {/* Job Details Card */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6">
        <JobDetailsHeader job={job} formattedDate={formattedDate} avatarText={avatarText} />
      </div>

      {/* Job Description Card */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6">
        <JobDescription job={job} />
      </div>

      {/* Action Buttons */}
      <ActionButtons
        handleGoBack={handleGoBack}
        setIsEditing={setIsEditing}
        setShowDeleteConfirm={setShowDeleteConfirm}
      />
    </>
  )
}
