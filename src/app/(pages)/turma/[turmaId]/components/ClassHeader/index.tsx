import { useRouter } from "next/navigation";
import { CaretLeftIcon } from "@phosphor-icons/react";
import { ClassDetails, useClassStore } from "@/store/useClassStore";
import { useAuthStore } from "@/store/useAuthStore";

interface QuestionnaireGrade {
  questionnaireId: number;
  questionnaireTitle: string;
  earnedPoints: number;
  totalPoints: number;
  percentage: number;
}

interface StudentGrades {
  studentId: number;
  classId: number;
  questionnaires: QuestionnaireGrade[];
  totalEarnedPoints: number;
  totalPossiblePoints: number;
  finalGrade: number;
}

export function ClassHeader({
  classDetails,
  grades,
}: {
  classDetails: ClassDetails;
  grades: StudentGrades;
}) {
  const router = useRouter();
  const { clearCurrentClass, releaseResult } = useClassStore();
  const { user } = useAuthStore();
  const isStudent = user?.role === "student";
  const handleGoBack = () => {
    clearCurrentClass();
    router.push("/turmas");
  };
  return (
    <div className="bg-blue-logo text-white p-4 md:p-8 rounded-t-md">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 md:gap-0">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <button
              onClick={handleGoBack}
              className="hover:bg-logo-bege rounded-md cursor-pointer p-1 transition-colors"
            >
              <CaretLeftIcon size={22} />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold">
              {classDetails.name}
            </h1>
          </div>
          <p className="text-base md:text-lg pl-8 mt-1">
            {classDetails.teacher?.name}
          </p>
          <p className="pl-8 text-sm md:text-base opacity-90">
            {classDetails.description}
          </p>
        </div>
        {isStudent && releaseResult && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/20 md:ml-4 self-start md:self-auto">
            <p className="text-xs md:text-sm font-medium opacity-80 mb-1">
              Média
            </p>
            <p className="text-xl md:text-3xl font-bold">{grades.finalGrade}</p>
          </div>
        )}
      </div>
    </div>
  );
}
