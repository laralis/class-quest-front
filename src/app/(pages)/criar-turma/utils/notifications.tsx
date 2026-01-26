import { toast } from "react-toastify";
import { CheckIcon } from "@phosphor-icons/react";

export const notifySuccess = () => {
  toast(
    () => (
      <span className="text-green-logo font-light">
        Turma criada com sucesso!
      </span>
    ),
    {
      position: "bottom-right",
      autoClose: 5000,
      className: "bg-white",
      icon: <CheckIcon size={22} weight="bold" className="text-green-logo" />,
    }
  );
};

export const notifyError = (message: string) => {
  toast.error(message);
};
