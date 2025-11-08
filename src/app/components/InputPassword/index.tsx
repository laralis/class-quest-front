import { useState } from "react";
import { InputText } from "../InputText";
import { EyeClosedIcon, EyeIcon } from "@phosphor-icons/react";

export function InputPassword() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <InputText
        type={showPassword ? "text" : "password"}
        id="password"
        placeholder="Senha"
        required
        text="Senha"
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
