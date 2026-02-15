import { XIcon } from "@phosphor-icons/react";
import { Button } from "../Button";

export function ConfirmModal({
  isOpen,
  setIsOpen,
  title,
  handleSuccess,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  title: string;
  handleSuccess: () => Promise<void> | void;
}) {
  const onRequestClose = () => {
    setIsOpen(false);
    return;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md relative">
        <button
          onClick={onRequestClose}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-500 hover:text-gray-700"
        >
          <XIcon size={20} className="sm:w-6 sm:h-6" />
        </button>

        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-logo mb-4 pr-8">
          {title}
        </h2>

        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4">
          <button
            type="button"
            onClick={onRequestClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 text-sm sm:text-base w-full sm:w-auto"
          >
            Cancelar
          </button>
          <Button
            onClick={async () => {
              await handleSuccess();
              setIsOpen(false);
            }}
            className="px-4 py-2 bg-blue-logo text-white rounded-md hover:bg-green-logo text-sm sm:text-base w-full sm:w-auto"
          >
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  );
}
