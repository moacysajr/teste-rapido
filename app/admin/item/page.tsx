import { getItems } from "@/app/_actions/get-item"
import CreateItemModal from "@/app/_components/adminComponents/CreateItemModal"
import EditItem from "@/app/_components/adminComponents/EditItem"
import { Separator } from "@/app/_components/ui/separator"
import { authOptions } from "@/app/_lib/auth"
import { db } from "@/app/_lib/prisma"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { FC } from "react"


const page: FC = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  if (!session?.user.isAdmin) {
    redirect("/")
  }

  const allItems = await getItems()
  const barberShop = await db.barbershop.findFirst({ select: { id: true } })


  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Itens oferecidos:
        </h1>
        
          <CreateItemModal barberShopId={barberShop?.id!} />

      </div>
      <Separator className="my-5" />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
        {allItems.map((item) => (
          <EditItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}

export default page
