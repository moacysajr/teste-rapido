
// import FinishClient from "./FinishClient"
// import { getOrders } from "@/app/_actions/get-product"

import OrderTable from "@/app/_components/OrderTable";



export default async function FinishPage() {


  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Pedidos Pendentes</h1>
      
      <OrderTable />
    </div>
  )

  // const orders = await getOrders()
  //   if(!orders){
  //     return( <h1>ocorreu um erro ao encontrar os pedidos</h1>)
  //   } 

  


  // const formattedOrders = orders.map((order) => ({
  //   ...order,
  //   totalPrice: order.totalPrice.toNumber(),
  //   items: order.items.map((orderItem) => ({
  //     ...orderItem,
  //     item: {
  //       ...orderItem.item,
  //       price: orderItem.item.price.toString(),
  //     },
  //   })),
  // }))

  // return <FinishClient initialOrders={formattedOrders} />
}
