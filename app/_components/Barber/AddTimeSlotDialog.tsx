"use client"
import { FC, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "../ui/form"
import { addBarberTimeSlot } from "@/app/_actions/add-timeslot"

import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface AddTimeSlotDialogProps {
  barberId: string
  barbershopId: string
}

const formSchema = z.object({
  timeSlot: z.string().min(1, {}).max(5),
})

const AddTimeSlotDialog: FC<AddTimeSlotDialogProps> = ({ barberId }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      timeSlot: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const newTimeslot = await addBarberTimeSlot(
        // TODO: Pegar o id da dinamicamente barber aqui
        "b5506fc5-f52b-43e2-be2a-a0c9e1935edf",
        values.timeSlot,
        barberId,
      )
      toast.success(`Horário ${newTimeslot.time} criado com sucesso!`)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Ocorreu um erro: ${error.message}`)
      } else {
        toast.error("Ocorreu um erro: desconhecido")
      }
      throw error
    } finally {
      setIsDialogOpen(false)
      setIsLoading(false)
    }
  }
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="mt-4">Adicionar Novo Horário</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Horário</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="timeSlot"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horário:</FormLabel>
                  <FormControl>
                    <Input placeholder="HH:MM" {...field} />
                  </FormControl>
                  <FormDescription>Exemplo: 10:00, 15:15</FormDescription>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Adicionar"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddTimeSlotDialog
