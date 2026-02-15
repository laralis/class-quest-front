import { TabType, ClassDetails } from "../../utils/types";
import { FeedTab } from "../FeedTab";
import { StudentsTab } from "../StudentsTab";
import { HistoryTab } from "../HistoryTab";
import { useAuthStore } from "@/store/useAuthStore";

interface TabContentProps {
  activeTab: TabType;
  classDetails: ClassDetails;
  accessCode: string;
}

export function TabContent({ activeTab, classDetails }: TabContentProps) {
  const { user } = useAuthStore();
  const isStudent = user?.role === "student";
  return (
    <main className="max-w-5xl mx-auto p-4 sm:p-6">
      {activeTab === "feed" && (
        <FeedTab questionnaires={classDetails.questionnaires} />
      )}
      {activeTab === "students" && (
        <StudentsTab students={classDetails.students} />
      )}

      {activeTab === "history" && isStudent && <HistoryTab />}
      {activeTab === "generalGrade" && isStudent && <HistoryTab />}
    </main>
  );
}
