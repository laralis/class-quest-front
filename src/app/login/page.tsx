import Link from "next/link";

export default function Login() {
  return (
    <div className="items-center justify-center text-sm min-h-screen p-8 pb-20 sm:p-24 max-w-xl m-auto">
      <form className="flex flex-col gap-4 shadow-md rounded-3xl bg-white p-8">
        <label htmlFor="email" className="flex flex-col gap-2">
          Email
          <input
            type="email"
            id="email"
            placeholder="Email"
            className="border py-2 px-4 rounded-3xl shadow-md"
          />
        </label>
        <label htmlFor="password" className="flex flex-col gap-2">
          Senha
          <input
            type="password"
            id="password"
            placeholder="Senha"
            className="border py-2 px-4 rounded-3xl shadow-md"
          />
        </label>
        <button
          type="submit"
          className=" text-white p-2 rounded-3xl shadow-md bg-gradient-to-r from-pink-300 to-pink-400 disabled:from-gray-300 disabled:to-gray-400 hover:cursor-pointer hover:from-purple-300 hover:to-purple-400"
        >
          Entrar
        </button>
        <Link
          href="/signup"
          className="flex justify-center text-pink-500 p-2 rounded-3xl border-1 bg-transparent hover:bg-gradient-to-r  hover:from-pink-300 hover:to-pink-400  hover:cursor-pointer hover:text-white hover:shadow-md"
        >
          Criar nova conta
        </Link>
      </form>
    </div>
  );
}
