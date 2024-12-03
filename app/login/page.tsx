import { auth } from "../_lib/auth";
import LoginForm from "../_components/login-form";

export default async function Page() {
  let user;

  try {
    user = await auth();
  } catch (error) {
    console.error("Error fetching user:", error);
    user = null;
  }

  if (user) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div>
          <h1>Welcome</h1>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <LoginForm />
    </div>
  );
}
