"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { StudentHistory } from "./components/StudentHistory";
import { TeacherHistoryPage } from "./components/TeacherHistoryPage";

export default function HistoryPage() {
  const { user } = useAuthStore();
  const isTeacher = user?.role === "teacher";

  if (isTeacher) {
    return <TeacherHistoryPage />;
  }

  return <StudentHistory />;
}
