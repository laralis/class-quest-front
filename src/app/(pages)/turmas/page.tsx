"use client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useClasses } from "./hooks/useClasses";
import { ClassesGrid } from "./components/ClassesGrid";

export default function CriarTurma() {
  const { classes, loading, reloadClasses } = useClasses();

  if (loading) {
    return <div className="p-10 text-center">Carregando...</div>;
  }

  return (
    <>
      <div className="p-4 sm:p-6 md:p-10 max-w-[1250px] m-auto">
        <ClassesGrid classes={classes} onModalSuccess={reloadClasses} />
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
