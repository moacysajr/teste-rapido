"use client"
import { FC, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import CreateItemForm from "./forms/CreateItemForm"
import { Button } from "../ui/button"
import { Plus } from "lucide-react"

interface CreateItemModalProps {
  barberShopId: string | undefined
}

const CreateItemModal: FC<CreateItemModalProps> = ({ barberShopId }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  if (barberShopId) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button asChild>
            <DialogTrigger>
              <Plus className="mr-2 h-5 w-5" />
              Adicionar novo
            </DialogTrigger>
          </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo item</DialogTitle>
          <DialogDescription>
            Preencha o formulário abaixo para criar um novo item.
          </DialogDescription>
          <CreateItemForm barberShopId={barberShopId} setIsDialogOpen={setIsDialogOpen} />
        </DialogHeader>
      </DialogContent>
      </Dialog>
    )
  }
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Algo deu errado...</DialogTitle>
        <DialogDescription>
          Não foi possível identificar sua barbearia... Entre em contato com o
          suporte.
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  )
}

export default CreateItemModal
