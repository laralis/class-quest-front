"use client";

import { Container } from "@/app/components/Container";
import { useState } from "react";
import { useClassDetails } from "./hooks/useClassDetails";
import { ClassHeader } from "./components/ClassHeader";
import { TabNavigation } from "./components/TabNavigation";
import { TabContent } from "./components/TabContent";
import { TabType } from "./utils/types";
import { useClassStore } from "@/store/useClassStore";
import { FloatingButtons } from "./components/FloatingButons";
import { useParams } from "next/navigation";
import { ToastContainer } from "react-toastify";

export default function ClassDetail() {
  const [activeTab, setActiveTab] = useState<TabType>("feed");
  const { currentClassDetails } = useClassStore();
  const params = useParams();
  const accessCode = params.turmaId as string;

  const { loading } = useClassDetails(accessCode);

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
        <ClassHeader classDetails={currentClassDetails} />
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        <TabContent activeTab={activeTab} classDetails={currentClassDetails} />
      </div>
      <FloatingButtons />
      <ToastContainer position="bottom-right" />
    </Container>
  );
}
