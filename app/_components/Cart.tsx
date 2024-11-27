"use client"
import { useState } from "react";

import useCartStore from "../_lib/cartStore";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import {  Loader2, ShoppingBasket } from "lucide-react";
import { createOrder } from "../_actions/create-order";
import { toast } from "sonner";
import Decimal from "decimal.js";

export default function Cart(){
    // eslint-disable-next-line no-unused-vars
    const { cart, clearCart } = useCartStore();
    const [isLoading, setIsLoading] = useState(false)
    const [IsSheetOpen, setIsSheetOpen] = useState(false)

    const totalAmount = cart.reduce(
        (total, item) =>
          total.plus(new Decimal(item.price).mul(item.quantity)),
        new Decimal(0)
      );

    const handleCheckout = async () => {
        setIsLoading(true)
        // Converter os preços para string antes de enviar ao servidor
            const cartData = cart.map((item) => ({
                ...item,
                price: item.price.toString(),
            }));
        
            const result = await createOrder(cartData);
        
            if (result.success) {
          toast.success("Pedido criado com sucesso!");
          clearCart();
        } else {
          toast.error(`Erro ao criar pedido...`);
        }
        setIsLoading(false)
      };

    return (
        <Sheet open={IsSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="bg-primary hover:bg-primary/80 fixed bottom-5 right-5 z-50 size-16 rounded-full"><ShoppingBasket className="size-7 text-primary-foreground" /></Button>
        </SheetTrigger>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Carrinho:</SheetTitle>
            <SheetDescription>
              Confira seus itens e ao final clique no botão para finalizar o pedido.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col ">
                {cart.length <=0 ? (
                    <p className="text-sm mx-auto text-muted-foreground">Nada no carrinho...</p>
                ) : (
                    <>
                    <ul className="space-y-3">
                        {cart.map((item)=> {
                            return <li key={item.id} className="border-b flex justify-between">
                            <span>
                                {item.name} <strong>({item.quantity}x)</strong>
                                </span>
                                <span>
                                    {Intl.NumberFormat("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                    }).format(Number(item.price))} 
                                </span>
                            </li>
                        })}
                    </ul>
                    <h2 className="text-lg mt-5 font-bold">
                        Total: {Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                                }).format(Number(totalAmount.toNumber()))}
                    </h2>
                    </>
                )}
            </div>
          </div>
          <SheetFooter>
          {cart.length <=0 ? (
                    ""
                ) : (
              <Button
              disabled={isLoading}
              onClick={() => {
                handleCheckout()
                }}>
                    {isLoading ? (
                        <>
                        <Loader2 className="animate-spin size-4 mr-2"/>
                        Finalizando...
                        </>
                    ) : ( <> Finalizar pedido</>)}
                   </Button>)}
          
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
}