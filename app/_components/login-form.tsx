import { signIn } from "@/app/_lib/auth"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
 
export function SignIn() {
  return (
    <form
      action={async (formData) => {
        "use server"
       
        await signIn("credentials", formData,{})
      }}
    >
      <Label>
        Celular
        <Input name="phone" />
      </Label>
      <Label>
        Senha
        <Input name="password" type="password" />
      </Label>
      <Button>Sign In</Button>
    </form>
  )
}