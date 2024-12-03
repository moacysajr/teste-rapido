
import { FC } from "react"
import { SignIn } from "../_components/login-form"
import { auth } from "../_lib/auth"

interface pageProps {}

const page: FC<pageProps> = async ({}) => {

    const user = await auth()
    console.log(user)
    if (user ){
      return<div>{
      JSON.stringify(user)
      }</div> 
    }
   
  return (
    <div className="flex h-full w-full items-center justify-center">
      <SignIn/>
    </div>
  )
}

export default page