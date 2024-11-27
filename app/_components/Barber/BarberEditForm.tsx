// app/components/barber-edit-form.tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Button } from "../ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { useEffect } from "react"
import { updateBarber } from "@/app/_actions/update-barber"

// Define o schema de validação com Zod
const barberFormSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  imageUrl: z
    .string()
    .url({
      message: "URL da imagem inválida.",
    })
    .or(z.literal("")), // Permite string vazia ao invés de null
  bio: z
    .string()
    .max(500, {
      message: "Bio deve ter no máximo 500 caracteres.",
    })
    .or(z.literal("")), // Permite string vazia ao invés de null
})

type BarberFormValues = z.infer<typeof barberFormSchema>

interface BarberEditFormProps {
  initialData: {
    id: string
    name: string
    email: string
    imageUrl?: string | null
    bio?: string | null
    barbershopId: string
  }
}

// TODO: adicionar instagram do barbeiro

export default function BarberEditForm({ initialData }: BarberEditFormProps) {
  const form = useForm<BarberFormValues>({
    resolver: zodResolver(barberFormSchema),
    defaultValues: {
      name: "",
      email: "",
      imageUrl: "",
      bio: "",
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        email: initialData.email,
        imageUrl: initialData.imageUrl || "", // Converte null para string vazia
        bio: initialData.bio || "", // Converte null para string vazia
      })
    }
  }, [initialData, form])

  async function handleSubmit(data: BarberFormValues) {
    try {
      // Converte strings vazias para null antes de enviar para o servidor
      const submitData = {
        ...data,
        imageUrl: data.imageUrl || null,
        bio: data.bio || null,
      }

      const result = await updateBarber(initialData.id, submitData)

      if (result.success) {
        toast.success("Perfil atualizado com sucesso!")
      } else {
        throw new Error("Erro ao atualizar perfil")
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Erro ao atualizar perfil. Tente novamente.")
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="seu.email@exemplo.com"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Este email será usado também para login
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL da Imagem de Perfil</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://exemplo.com/sua-imagem.jpg"
                  {...field}
                  value={field.value || ""} // Garante que o valor nunca seja null
                />
              </FormControl>
              <FormDescription>URL da sua foto de perfil</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biografia</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Conte um pouco sobre você e sua experiência..."
                  className="h-32"
                  {...field}
                  value={field.value || ""} // Garante que o valor nunca seja null
                />
              </FormControl>
              <FormDescription>
                Sua biografia profissional (máximo 500 caracteres)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Salvando..." : "Salvar alterações"}
        </Button>
      </form>
    </Form>
  )
}
