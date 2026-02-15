import { useAuthStore } from "@/store/useAuthStore";
import { TabType } from "../../utils/types";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const { user } = useAuthStore();
  const isStudent = user?.role === "student";

  const tabs: { id: TabType; label: string }[] = [
    { id: "feed", label: "Feed" },
    { id: "students", label: "Alunos" },
    ...(isStudent
      ? [{ id: "history" as TabType, label: "Histórico" }]
      : [{ id: "generalGrade" as TabType, label: "Nota e resumo" }]),
  ];

  return (
    <div className="border-b bg-white rounded-b-md">
      <div className="max-w-5xl mx-auto">
        <nav className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 sm:px-6 py-3 sm:py-4 font-medium cursor-pointer whitespace-nowrap text-sm sm:text-base ${
                activeTab === tab.id
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
