import ReactModal from "react-modal";
import { XIcon } from "@phosphor-icons/react";
import { Button } from "../Button";
import { ButtonIcon } from "../ButtonIcon";
import { useEffect } from "react";

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

  useEffect(() => {
    ReactModal.setAppElement("#app-root");
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      shouldCloseOnEsc
      overlayClassName="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4"
      className="relative z-[10000] w-full max-w-md max-h-[90vh] bg-white rounded-lg outline-none overflow-y-auto"
    >
      <div className="flex items-center justify-between p-4 sm:p-6 pb-3 sm:pb-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-logo pr-8">
          {title}
        </h2>
        <ButtonIcon
          onClick={onRequestClose}
          className="hover:bg-red-100 text-red-600"
          aria-label="Fechar modal"
          title="Fechar"
        >
          <XIcon size={20} weight="bold" className="sm:w-6 sm:h-6" />
        </ButtonIcon>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 px-4 sm:px-6 pb-4 sm:pb-6">
        <Button
          type="button"
          onClick={onRequestClose}
          className="!bg-transparent !text-gray-700 hover:!bg-gray-100 text-sm sm:text-base w-full sm:w-auto"
          aria-label="Cancelar ação"
        >
          Cancelar
        </Button>
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
    </ReactModal>
  );
}
