import { CheckIcon } from "@phosphor-icons/react";

interface InputRadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  index: number;
  selectedOption: number | null;
  setSelectedOption: (index: number) => void;
}
export function InputRadio({
  index,
  selectedOption,
  setSelectedOption,
}: InputRadioProps) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="radio"
        name={`option_group`}
        id={`option_${index}`}
        checked={selectedOption === index}
        onChange={() => setSelectedOption(index)}
        className="sr-only"
      />
      <span
        className="w-5 h-5 inline-flex items-center justify-center border border-gray-300 rounded-full bg-white"
        aria-hidden="true"
      >
        {selectedOption === index && (
          <CheckIcon size={12} className="text-green-logo" />
        )}
      </span>
    </label>
  );
}
