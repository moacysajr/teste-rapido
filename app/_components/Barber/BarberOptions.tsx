import { useState } from "react";
import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { toast } from "sonner";
import { deleteBarber } from "@/app/_actions/delete-barber";
import { X } from "lucide-react";

interface DeleteBarberDialogProps {
  barberId: string;
}

export const DeleteBarberDialog: React.FC<DeleteBarberDialogProps> = ({ barberId }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await deleteBarber(barberId);
      if (response.success) {
        toast.success("Barbeiro excluído com sucesso!");
        setIsDialogOpen(false); // Fecha o diálogo somente após sucesso
      } else {
        toast.error(response.message || "Não foi possível excluir o barbeiro.");
      }
    } catch (error) {
      if(error instanceof Error){

        toast.error("Erro ao excluir barbeiro:" + error.message);
      }
      console.error("Erro ao excluir barbeiro:", error);
      toast.error("Não foi possível excluir o barbeiro.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      {/* Passando apenas UM filho direto para DialogTrigger */}
      <DialogTrigger>
        <Button variant="ghost"><X className="size-5"/></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogDescription>
            Tem certeza de que deseja excluir este barbeiro? Essa ação não pode ser desfeita. <br /> O barbeiro precisa encerrar todos os seus atendimentos antes de ser deletado. Você pode desativar o horário de funcionamento do barbeiro caso não queria que ele receba novos atendimentos. 
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
