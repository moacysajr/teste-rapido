"use client"

import { Minus, Plus } from "lucide-react"
import { Button } from "./ui/button"
import { Decimal } from "@prisma/client/runtime/library"
import Image from "next/image"
import { Card, CardContent } from "./ui/card"
import { useState } from "react"
import useCartStore from "../_lib/cartStore"
import { toast } from "sonner"

interface Item {
    id: string,
    name: string,
    imageUrl: string,
    description: string | null,
    price: Decimal,
    barbershopId: string,
    createdAt: Date,
    updatedAt: Date
}


export default function ProductItem({ item }: {item: Item}){
    const [Quantity, setQuantity] = useState<number>(0)

    const { addItem } = useCartStore();

    return (
        <Card
            key={item.id}
          >
            <CardContent className="flex items-end justify-between gap-4 rounded-lg p-4">
                <div className="flex flex-col md:flex-row gap-4">


            <div className="relative size-20 md:size-28 flex-shrink-0">
              <Image
                src={item.imageUrl || "/placeholder.png"}
                alt={item.name}
                fill
                className="rounded-lg object-cover"
                />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-sm">{item.name}</h3>
              {item.description && (
                  <p className="mt-0.5 text-sm text-muted-foreground">
                  {item.description}
                </p>
              )}
            </div>
              </div>

            <div className="flex flex-col items-end gap-2">
              <span className="whitespace-nowrap font-medium text-primary">
                {Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }).format(Number(item.price))} 
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={()=> setQuantity(Quantity+1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center text-sm">
                  {Quantity}
                </span>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    if(Quantity > 0){
                        setQuantity(Quantity-1)
                    }
                  }}
                  
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="secondary"
                size="sm"
                disabled={Quantity===0}
                onClick={() => {
                  addItem(item, Quantity)
                  toast.success(`Adicionado(s) ${Quantity}x ${item.name}(s) ao carrinho!}`)
                  setQuantity(0)
                }}
                >
                Adicionar ao Carrinho
              </Button>
            </div>
        </CardContent>
        </Card>
    )
}