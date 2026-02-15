import { CopySimpleIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { Class } from "../../utils/types";
import { notifyCodeCopied } from "../../utils/notifications";

interface ClassCardProps {
  classData: Class;
}

export function ClassCard({ classData }: ClassCardProps) {
  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    notifyCodeCopied();
  };
  console.log(classData.logoUrl);

  return (
    <Link
      className="border-dotted border-2 border-gray-700 rounded-lg w-full h-[200px] sm:h-[180px] md:h-[200px] relative"
      href={`/turma/${classData.accessCode}`}
    >
      <Image
        src={classData.logoUrl || "/cover.jpg"}
        alt="Capa"
        width={200}
        height={200}
        className="object-cover w-full h-full rounded-lg relative blur-[2px]"
      />
      <div className="absolute inset-0 flex flex-col justify-center w-fit mx-auto">
        <div
          className="bg-white rounded-lg p-2 mx-4 sm:mx-8"
          title={classData.name}
        >
          <div className="w-full">
            <h2 className="text-xl sm:text-2xl text-center line-clamp-2">
              {classData.name}
            </h2>
            <div className="flex justify-center gap-2 text-xs sm:text-sm">
              <label htmlFor="code">Código:</label>
              <span id="code">{classData.accessCode}</span>
              <button
                onClick={(e) => handleCopyCode(classData.accessCode, e)}
                className="p-1 cursor-pointer m-[-1px]"
                aria-label="Copiar código"
                title="Copiar código"
              >
                <CopySimpleIcon size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
