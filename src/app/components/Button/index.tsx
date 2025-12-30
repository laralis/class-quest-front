interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: () => void;
  primary?: boolean;
}

export function Button({
  children,
  onClick,
  className,
  primary,
  ...props
}: ButtonProps) {
  const primaryClass = "bg-blue-logo text-white hover:bg-green-logo";

  if (primary) {
    return (
      <button
        onClick={onClick}
        className={`px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer ${
          className || ""
        } ${primaryClass}`}
        {...props}
      >
        {children}
      </button>
    );
  }
}
