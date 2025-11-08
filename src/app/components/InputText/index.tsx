interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  text?: string;
}

export function InputText({ className, text, ...props }: InputTextProps) {
  return (
    <div className="relative flex-1">
      <label
        htmlFor="title"
        className="absolute top-[-3px] left-[8] z-10 text-[11.5px] bg-white leading-2"
      >
        {text}
      </label>
      <input
        type="text"
        className={`w-full  outline-none rounded-md  focus:border-blue-logo focus:bg-white bg-white border border-gray-200 h-[40px] p-2 ${className}`}
        {...props}
      />
    </div>
  );
}
