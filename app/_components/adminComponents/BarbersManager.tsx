"use client";

import { FC, useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";


import { createBarberFromUser } from "@/app/_actions/create-barber";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/_components/ui/avatar";
import { Button } from "@/app/_components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { getBarbers } from "@/app/_actions/get-barbers";
import { DeleteBarberDialog } from "../Barber/BarberOptions";
import { Loader2 } from "lucide-react";

export interface Barber {
  id: string;
  name: string;
  email: string;
  imageUrl?: string | null;
  bio?: string | null; // Inclui null explicitamente
  barbershopId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface BarbersManagerProps {
  barbershopId: string;
}

const CreateBarberFormSchema = z.object({
  email: z.string().min(1, { message: "O campo é obrigatório" }).email(),
});

const BarbersManager: FC<BarbersManagerProps> = ({ barbershopId }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true)
  const [barbers, setBarbers] = useState<Barber[]>([]);

  const form = useForm<z.infer<typeof CreateBarberFormSchema>>({
    resolver: zodResolver(CreateBarberFormSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    async function fetchBarbers() {
      try {
        const barbers = await getBarbers(barbershopId)
        setBarbers(barbers);
      } catch (error) {
        console.error("Erro ao buscar barbeiros:", error);
      }
    }

    fetchBarbers();
    setIsLoading(false)
  }, [barbershopId]);

  async function onSubmit(values: z.infer<typeof CreateBarberFormSchema>) {
    const response = await createBarberFromUser(values.email, barbershopId);

    if (response.success) {
      toast.success("Barbeiro adicionado!");
      setBarbers((prev) => [...prev, response.barber]); // Atualiza o estado com o novo barbeiro
    } else {
      toast.error(`Algo deu errado... ${response.message}`);
    }
    setIsDialogOpen(false);
    
  }

  return (
    <div className="space-y-8">
      {/* Lista de Barbeiros */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
        {isLoading && (
          <Loader2 className="size-5 animate-spin"/>
        )}  
        {barbers.map((barber) => (
          <div key={barber.id} className="flex items-center justify-between gap-4 p-4">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={barber.imageUrl || undefined} alt={barber.name} />
                <AvatarFallback>{barber.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{barber.name}</span>
            </div>
            <DeleteBarberDialog barberId={barber.id} />
          </div>
        ))}
        </div>
      </div>

      {/* Formulário de criação */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Button asChild>
          <DialogTrigger>Criar novo barbeiro</DialogTrigger>
        </Button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicione o email do barbeiro abaixo</DialogTitle>
            <DialogDescription>
              É necessário que o email já tenha logado pelo menos uma vez na plataforma.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email:</FormLabel>
                    <FormControl>
                      <Input placeholder="exemplo@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Criar barbeiro</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BarbersManager;
