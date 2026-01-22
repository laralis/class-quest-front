"use client";

import { Image as ImageIcon, X } from "@phosphor-icons/react";
import { useState } from "react";
import Image from "next/image";

interface InputImageProps {
  id: string;
  text: string;
  onChange?: (file: File | null) => void;
  accept?: string;
}

export function InputImage({
  id,
  text,
  onChange,
  accept = "image/*",
}: InputImageProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onChange?.(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setFileName("");
    onChange?.(null);
    const input = document.getElementById(id) as HTMLInputElement;
    if (input) input.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-blue-logo font-medium">
        {text}
      </label>
      <div className="relative">
        <input
          type="file"
          id={id}
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor={id}
          className="flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <ImageIcon size={20} className="text-blue-logo" />
          <span className="text-sm text-gray-600">
            {fileName || "Selecionar imagem"}
          </span>
        </label>

        {preview && (
          <div className="mt-3 relative">
            <div className="relative w-full h-48 rounded-md overflow-hidden border border-gray-300">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X size={16} weight="bold" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
