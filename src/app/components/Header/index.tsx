"use client";
import Image from "next/image";
import { SignOutIcon } from "@phosphor-icons/react";
export function Header() {
  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="text-lg p-4">Olá, Larissa</div>
          <div className="flex-shrink-0 flex items-center">
            <Image
              src={"/textlogo.png"}
              alt={"Logo"}
              width={150}
              height={60}
              className="bg-transparent"
            />
          </div>
          <div className="p-4">
            <button className="text-black px-4 py-2 rounded-md hover:bg-background transition cursor-pointer">
              <SignOutIcon className="inline-block mr-2" size={25} alt="Sair" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
