import Image from "next/image"
import BlueprintLeft from "@/assets/images/BlueprintLeft.png";
import BlueprintRight from "@/assets/images/BlueprintRight.png";

export default function BackgroundDesign() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute top-0 left-0 h-full w-2/12 overflow-hidden">
        <Image
          src={BlueprintLeft }
          alt="Left background design"
          className="object-cover h-full"
          priority
          fill
        />
      </div>
      <div className="absolute top-0 right-0 h-full w-2/12 overflow-hidden">
        <Image
          src={BlueprintRight }
          alt="Right background design"
          className="object-cover h-full "
          priority
          fill
        />
      </div>
    </div>
  )
}
