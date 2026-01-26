import { useState, InputHTMLAttributes } from "react";
import { InputText } from "../InputText";
import { EyeClosedIcon, EyeIcon } from "@phosphor-icons/react";

interface InputPasswordProps extends InputHTMLAttributes<HTMLInputElement> {
  text?: string;
}

export function InputPassword({
  text = "Senha",
  ...props
}: InputPasswordProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <InputText
        {...props}
        type={showPassword ? "text" : "password"}
        text={text}
        required
        placeholder="Senha"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-[10px] text-gray-500 hover:text-gray-700"
      >
        {showPassword ? <EyeIcon size={20} /> : <EyeClosedIcon size={20} />}
      </button>
    </div>
  );
}
