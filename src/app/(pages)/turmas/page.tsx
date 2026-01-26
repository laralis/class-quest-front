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
      <div className="p-10 max-w-[1250px] m-auto">
        <ClassesGrid classes={classes} onModalSuccess={reloadClasses} />
      </div>
      <ToastContainer position="bottom-right" />
    </>
  );
}
