
import { FC } from "react"
import { SignIn } from "../_components/login-form"

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
 
  return (
    <div className="flex h-full w-full items-center justify-center">
      <SignIn/>
    </div>
  )
}

export default page
