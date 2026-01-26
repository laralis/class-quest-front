"use client";

import { Container } from "@/app/components/Container";
import { useState, useEffect } from "react";
import { useClassDetails } from "./hooks/useClassDetails";
import { ClassHeader } from "./components/ClassHeader";
import { TabNavigation } from "./components/TabNavigation";
import { TabContent } from "./components/TabContent";
import { CreateQuestionnaireButton } from "./components/CreateQuestionnaireButton";
import { TabType } from "./utils/types";
import { useClassStore } from "@/store/useClassStore";

export default function ClassDetail({
  params,
}: {
  params: Promise<{ turmaId: string }>;
}) {
  const [activeTab, setActiveTab] = useState<TabType>("feed");
  const { setCurrentClassCode, currentClassCode } = useClassStore();

  useEffect(() => {
    params.then((p) => setCurrentClassCode(p.turmaId));
  }, [params]);

  const { classDetails, loading } = useClassDetails(currentClassCode);

  if (loading || !classDetails) {
    return (
      <Container>
        <div className="text-center py-8 text-gray-500">Carregando...</div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="bg-gray-50 rounded-md">
        <ClassHeader classDetails={classDetails} />
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        <TabContent
          activeTab={activeTab}
          classDetails={classDetails}
          accessCode={currentClassCode}
        />
      </div>
      <CreateQuestionnaireButton />
    </Container>
  );
}
