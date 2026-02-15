"use client";
import { ToastContainer } from "react-toastify";
import { CreateClassForm } from "./components/CreateClassForm";

export default function CriarTurma() {
  return (
    <>
      <div className="items-center justify-center text-blue-logo text-sm p-4 pb-16 sm:p-8 sm:pb-20 md:p-24 max-w-xl m-auto">
        <CreateClassForm />
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        progressClassName="!bg-blue-logo"
        className="text-sm sm:text-base"
      />
    </>
  );
}
