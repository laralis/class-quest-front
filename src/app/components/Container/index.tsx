interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}
export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={`max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 ${className}`}
    >
      {children}
    </div>
  );
}
