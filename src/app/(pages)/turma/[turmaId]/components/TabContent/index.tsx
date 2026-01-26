import { TabType, ClassDetails } from "../../utils/types";
import { FeedTab } from "../FeedTab";
import { StudentsTab } from "../StudentsTab";
import { HistoryTab } from "../HistoryTab";

interface TabContentProps {
  activeTab: TabType;
  classDetails: ClassDetails;
  accessCode: string;
}

export function TabContent({
  activeTab,
  classDetails,
  accessCode,
}: TabContentProps) {
  return (
    <main className="max-w-5xl mx-auto p-6">
      {activeTab === "feed" && (
        <FeedTab questionnaires={classDetails.questionnaires} />
      )}
      {activeTab === "students" && <StudentsTab classCode={accessCode} />}
      {activeTab === "history" && <HistoryTab />}
    </main>
  );
}
