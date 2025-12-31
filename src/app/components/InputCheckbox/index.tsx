import { CheckIcon } from "@phosphor-icons/react";

interface InputCheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  checked: boolean;
}
export function InputCheckbox({ checked, ...props }: InputCheckboxProps) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        name="timer"
        id="timer"
        checked={checked}
        className="sr-only"
        {...props}
      />
      <span
        className="w-5 h-5 inline-flex items-center justify-center border border-gray-300 rounded-sm bg-white"
        aria-hidden="true"
      >
        {checked && <CheckIcon size={12} className="text-green-logo" />}
      </span>
    </label>
  );
}
