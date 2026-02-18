"use client";
import "react-toastify/dist/ReactToastify.css";
import { CreateAccountForm } from "./components/CreateAccountForm";
import { ToastContainer } from "react-toastify";

export default function CriarConta() {
  return (
    <div className="min-w-[320px] text-blue-logo text-sm sm:p-24 max-w-xl m-auto min-h-screen flex items-center justify-center">
      <CreateAccountForm />
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
    </div>
  );
}
