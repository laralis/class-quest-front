interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: () => void;
}

export function Button({
  children,
  onClick,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </button>
  );
}
