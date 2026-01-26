import { toast } from "react-toastify";

export const notifyCodeCopied = () => {
  toast.success("Código copiado!", {
    position: "bottom-right",
    autoClose: 2000,
  });
};
