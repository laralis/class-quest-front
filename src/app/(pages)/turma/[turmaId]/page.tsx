"use client";

import { Container } from "@/app/components/Container";
import { useEffect, useState } from "react";
import { useClassDetails } from "./hooks/useClassDetails";
import { ClassHeader } from "./components/ClassHeader";
import { TabNavigation } from "./components/TabNavigation";
import { TabContent } from "./components/TabContent";
import { TabType } from "./utils/types";
import { useClassStore } from "@/store/useClassStore";
import { FloatingButtons } from "./components/FloatingButons";
import { useParams } from "next/navigation";
import { ToastContainer } from "react-toastify";
import { getClassGrades } from "./services/classService";
import { useAuthStore } from "@/store/useAuthStore";

export default function ClassDetail() {
  const [activeTab, setActiveTab] = useState<TabType>("feed");
  const { currentClassDetails } = useClassStore();
  const params = useParams();
  const accessCode = params.turmaId as string;
  const { token, user } = useAuthStore();

  const { loading } = useClassDetails(accessCode);

  const [grades, setGrades] = useState([]);

  useEffect(() => {
    if (user && currentClassDetails.id) {
      const loadGrades = async () => {
        const response = await getClassGrades(
          currentClassDetails.id,
          user.id,
          token,
        );
        setGrades(response);
      };
      loadGrades();
    }
  }, [currentClassDetails.id, token, user]);

  if (loading || !currentClassDetails.id) {
    return (
      <Container>
        <div className="text-center py-8 text-gray-500">Carregando...</div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="bg-gray-50 rounded-md">
        <ClassHeader classDetails={currentClassDetails} grades={grades} />
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        <TabContent activeTab={activeTab} classDetails={currentClassDetails} />
      </div>
      <FloatingButtons />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        newestOnTop
        rtl={false}
        theme="light"
        progressClassName="!bg-blue-logo"
        className="text-sm sm:text-base"
      />
    </Container>
  );
}
