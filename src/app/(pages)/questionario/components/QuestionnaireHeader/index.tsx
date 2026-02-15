import { CaretLeftIcon } from "@phosphor-icons/react";

interface QuestionnaireHeaderProps {
  title: string;
  description: string;
  onBack: () => void;
}

export function QuestionnaireHeader({
  title,
  description,
  onBack,
}: QuestionnaireHeaderProps) {
  return (
    <div className="bg-blue-logo text-white p-3 md:p-6">
      <div className="flex items-center gap-2 md:gap-3 mb-1.5 md:mb-2">
        <button
          onClick={onBack}
          className="hover:bg-logo-bege p-1.5 md:p-2 rounded-md transition-all active:scale-95"
        >
          <CaretLeftIcon size={20} className="md:w-[22px] md:h-[22px]" />
        </button>
        <h1 className="text-base md:text-2xl font-bold line-clamp-2">
          {title}
        </h1>
      </div>
      <p className="text-xs md:text-sm opacity-90 pl-8 md:pl-11 line-clamp-2">
        {description}
      </p>
    </div>
  );
}
