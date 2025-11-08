import { Button } from "@/app/components/Button";
import { InputText } from "@/app/components/InputText";
import { useState } from "react";
import { XIcon } from "@phosphor-icons/react";

export function SectionAddStudents() {
  const [students, setStudents] = useState<string[]>([]);
  const [studentEmail, setStudentEmail] = useState<string>("");

  const handleAddStudent = () => {
    const email = studentEmail.trim();
    if (!email) return;
    if (students.includes(email)) {
      setStudentEmail("");
      return;
    }
    setStudents((prev) => [...prev, email]);
    setStudentEmail("");
  };

  const removeStudent = (email: string) => {
    setStudents((prev) => prev.filter((e) => e !== email));
  };
  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <InputText
            type="email"
            id="add-student"
            placeholder="Email do aluno"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
            aria-label="Email do aluno"
          />
          <Button
            type="button"
            onClick={handleAddStudent}
            className="hover:text-white bg-gradient-to-r hover:from-green-logo hover:to-blue-logo cursor-pointer "
          >
            Adicionar
          </Button>
        </div>
      </div>
      <section className="flex flex-wrap gap-2 mt-2">
        {students.map((email) => (
          <button
            key={email}
            className="flex items-center gap-2 bg-bege-logo text-blue-logo px-3 py-1 rounded-full text-sm cursor-pointer"
            type="button"
            onClick={() => removeStudent(email)}
            aria-label={`Remover ${email}`}
          >
            {email}

            <XIcon size={12} weight="bold" />
          </button>
        ))}
      </section>
    </>
  );
}
