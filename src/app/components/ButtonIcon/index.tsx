interface ButtonIconProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export function ButtonIcon({
  children,
  onClick,
  className = "",
  ...props
}: ButtonIconProps) {
  return (
    <button
      onClick={onClick}
      className={`p-1 hover:bg-gray-200 rounded disabled:opacity-50 cursor-pointer max-h-fit my-auto ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
