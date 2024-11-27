// components/TimeslotsManager.tsx
import { Suspense } from "react"
import { Separator } from "../ui/separator"

import AddTimeSlotDialog from "./AddTimeSlotDialog"
import TimeslotsTable from "./TimeslotsTable"

interface TimeslotsManagerProps {
  barberId: string
  barbershopId: string
}

export default function TimeslotsManager({
  barberId,
  barbershopId,
}: TimeslotsManagerProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Sua lista de horários
        </h1>
        <AddTimeSlotDialog barberId={barberId} barbershopId={barbershopId} />
      </div>

      <Separator className="my-4" />

      <Suspense fallback={<div>Carregando horários...</div>}>
        <TimeslotsTable barberId={barberId} />
      </Suspense>
    </div>
  )
}
