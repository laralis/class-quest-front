interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  primary?: boolean;
}

export function Button({
  children,
  onClick,
  className,
  ...props
}: ButtonProps) {
  const primaryClass = "bg-blue-logo text-white hover:bg-green-logo";

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer ${primaryClass}  ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </button>
  );
}
