export const dynamic = 'force-dynamic'; // Adiciona essa linha no início do arquivo

import { FC } from "react";
import LoginForm from "../_components/login-form";
import { auth } from "../_lib/auth";

const Page: FC = async () => {
  const user = await auth();

  if (user) {
    return (
      <div>
        {JSON.stringify(user)}
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <LoginForm />
    </div>
  );
};

export default Page;
