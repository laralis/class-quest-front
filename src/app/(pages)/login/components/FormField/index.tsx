import { ReactNode } from "react";

interface FormFieldProps {
  children: ReactNode;
  error?: string;
  touched?: boolean;
}

export function FormField({ children, error, touched }: FormFieldProps) {
  return (
    <div>
      {children}
      {touched && error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
