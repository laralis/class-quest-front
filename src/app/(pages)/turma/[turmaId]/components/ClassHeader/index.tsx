import { useRouter } from "next/navigation";
import { CaretLeftIcon } from "@phosphor-icons/react";
import { ClassDetails } from "../../utils/types";

interface ClassHeaderProps {
  classDetails: ClassDetails;
}

export function ClassHeader({ classDetails }: ClassHeaderProps) {
  const router = useRouter();

  return (
    <div className="bg-blue-logo text-white p-8 rounded-t-md">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="hover:bg-logo-bege rounded-md cursor-pointer"
          >
            <CaretLeftIcon size={22} />
          </button>
          <h1 className="text-3xl font-bold">{classDetails.name}</h1>
        </div>
        <p className="text-lg pl-8">{classDetails.teacher.name}</p>
        <p className="pl-8">{classDetails.description}</p>
      </div>
    </div>
  );
}
