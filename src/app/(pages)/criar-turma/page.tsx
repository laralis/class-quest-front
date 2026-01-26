"use client";
import { ToastContainer } from "react-toastify";
import { CreateClassForm } from "./components/CreateClassForm";

export default function CriarTurma() {
  return (
    <>
      <div className="items-center justify-center text-blue-logo text-sm p-8 pb-20 sm:p-24 max-w-xl m-auto">
        <CreateClassForm />
      </div>
      <ToastContainer closeButton theme="colored" position="bottom-right" />
    </>
  );
}
