import Image from "next/image";
import { InputText } from "@/app/components/InputText";
import { InputTextArea } from "@/app/components/InputTextArea";
import { InputImage } from "@/app/components/InputImage";
import { Button } from "@/app/components/Button";
import { useCreateClassForm } from "../../hooks/useCreateClassForm";
import { FormField } from "../FormField";

export function CreateClassForm() {
  const { formik, setClassImage } = useCreateClassForm();

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex flex-col gap-4 shadow-md rounded-3xl bg-white p-8"
    >
      <Image
        src="/favicon.png"
        alt="Logo"
        width={100}
        height={100}
        className="mx-auto my-[-20px]"
      />
      <h1 className="text-center font-bold text-2xl">Criar nova turma</h1>

      <FormField error={formik.errors.name} touched={formik.touched.name}>
        <InputText
          type="text"
          id="name"
          placeholder="Nome da turma"
          text="Nome"
          {...formik.getFieldProps("name")}
        />
      </FormField>

      <FormField
        error={formik.errors.description}
        touched={formik.touched.description}
      >
        <InputTextArea
          id="description"
          placeholder="Descrição da turma"
          text="Descrição"
          {...formik.getFieldProps("description")}
        />
      </FormField>

      <InputImage
        id="classImage"
        text="Imagem da turma"
        onChange={setClassImage}
      />

      <Button
        type="submit"
        disabled={formik.isSubmitting}
        className="text-white bg-gradient-to-r from-green-logo to-blue-logo disabled:from-gray-300 disabled:to-gray-400 hover:cursor-pointer hover:from-secondary-purple hover:to-purple-logo"
      >
        {formik.isSubmitting ? "Criando..." : "Criar turma"}
      </Button>
    </form>
  );
}
