interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function InputText({ className, ...props }: InputTextProps) {
  return (
    <input
      type="text"
      className={`border py-2 px-4 rounded-3xl shadow-md bg-white ${className}`}
      {...props}
    />
  );
}
