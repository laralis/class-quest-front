interface InputTextAreaProps
  extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  text?: string;
}

export function InputTextArea({
  className,
  text,
  ...props
}: InputTextAreaProps) {
  return (
    <div className="relative flex-1">
      <label
        htmlFor="title"
        className="absolute top-[-3px] left-[8] z-10 text-[11.5px] bg-white leading-2"
      >
        {text}
      </label>
      <textarea
        className={`w-full  outline-none rounded-md  focus:border-blue-logo focus:bg-white bg-white border border-gray-200 max-h-[120px] p-2 ${className}`}
        {...props}
        placeholder={text}
      />
    </div>
  );
}
