"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog"
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  ArrowUpDown,
} from "lucide-react"
import {
  getBarberTimeSlots,
  toggleTimeSlotAvailability,
  deleteTimeSlot,
} from "@/app/_actions/timeslot-actions"
import { useToast } from "@/app/hooks/use-toast"

interface TimeslotsTableProps {
  barberId: string
}

export default function TimeslotsTable({ barberId }: TimeslotsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [availabilityFilter, setAvailabilityFilter] = useState<
    "all" | "available" | "unavailable"
  >("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const { toast } = useToast()

  const [data, setData] = useState<{
    timeSlots: any[]
    totalPages: number
    currentPage: number
  }>({ timeSlots: [], totalPages: 1, currentPage: 1 })

  // Função para carregar os dados envolvida em useCallback
  const loadData = useCallback(async () => {
    try {
      const result = await getBarberTimeSlots(
        barberId,
        currentPage,
        availabilityFilter,
        sortOrder,
      )
      setData(result)
    } catch (error) {
      toast({
        title: "Erro ao carregar horários",
        description: "Não foi possível carregar os horários. Tente novamente.",
        variant: "destructive",
      })
    }
  }, [barberId, currentPage, availabilityFilter, sortOrder, toast])

  // useEffect com todas as dependências necessárias
  useEffect(() => {
    loadData()
  }, [loadData])

  const handleToggleAvailability = async (timeSlotId: string) => {
    const result = await toggleTimeSlotAvailability(timeSlotId)

    if (result.success) {
      toast({
        title: "Status atualizado",
        description: "A disponibilidade do horário foi atualizada com sucesso.",
      })
      loadData()
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do horário.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (timeSlotId: string) => {
    setSelectedTimeSlot(timeSlotId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedTimeSlot) return

    const result = await deleteTimeSlot(selectedTimeSlot)

    if (result.success) {
      toast({
        title: "Horário excluído",
        description: "O horário foi excluído com sucesso.",
      })
      loadData()
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o horário.",
        variant: "destructive",
      })
    }

    setDeleteDialogOpen(false)
    setSelectedTimeSlot(null)
  }

  return (
    <>
      <div className="mb-4 flex gap-4">
        <div className="inline-flex items-center gap-2">
          <p>Filtrar por:</p>
          <Select
            value={availabilityFilter}
            onValueChange={(value: "all" | "available" | "unavailable") => {
              setAvailabilityFilter(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="available">Disponíveis</SelectItem>
              <SelectItem value="unavailable">Indisponíveis</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="flex items-center gap-2"
              >
                Horário
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.timeSlots.map((slot) => (
            <TableRow key={slot.id}>
              <TableCell>{slot.time}</TableCell>
              <TableCell>
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    slot.isAvailable
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {slot.isAvailable ? "Disponível" : "Indisponível"}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleToggleAvailability(slot.id)}
                    >
                      {slot.isAvailable
                        ? "Marcar como indisponível"
                        : "Marcar como disponível"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDelete(slot.id)}
                    >
                      Excluir horário
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm">
          Página {data.currentPage} de {data.totalPages}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentPage((prev) => Math.min(data.totalPages, prev + 1))
          }
          disabled={currentPage === data.totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este horário? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
