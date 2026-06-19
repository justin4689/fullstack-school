"use client";

import { loginAction } from "@/lib/authActions";
import Image from "next/image";
import { useFormState, useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-blue-500 text-white my-1 rounded-md text-sm p-[10px] disabled:opacity-60"
    >
      {pending ? "Signing in..." : "Sign In"}
    </button>
  );
}

const LoginPage = () => {
  const [state, formAction] = useFormState(loginAction, { error: null });

  return (
    <div className="h-screen flex items-center justify-center bg-lamaSkyLight">
      <form
        action={formAction}
        className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-4 w-full max-w-sm"
      >
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Image src="/logo.png" alt="" width={24} height={24} />
          SchooLama
        </h1>
        <h2 className="text-gray-400">Sign in to your account</h2>

        {state.error && (
          <p className="text-sm text-red-400">{state.error}</p>
        )}

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Username</label>
          <input
            name="username"
            type="text"
            required
            className="p-2 rounded-md ring-1 ring-gray-300 outline-none focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Password</label>
          <input
            name="password"
            type="password"
            required
            className="p-2 rounded-md ring-1 ring-gray-300 outline-none focus:ring-blue-400"
          />
        </div>

        <SubmitButton />
      </form>
    </div>
  );
};

export default LoginPage;
