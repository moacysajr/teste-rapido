'use client';

import { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/app/_components/ui/table';
import { Dialog, DialogTrigger, DialogContent } from '@/app/_components/ui/dialog';
import { Button } from '@/app/_components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/app/_components/ui/dropdown-menu';
import { Badge } from './ui/badge';

type Order = {
  id: number;
  totalPrice: string;
  concluded: boolean;
  items: { item: { name: string }; quantity: number }[];
};

const OrderTable = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch(`/api/orders?page=${currentPage}`);
      const data = await res.json();
      setOrders(data.orders);
      setTotalPages(data.totalPages);
    };

    fetchOrders();
  }, [currentPage]);

  const handleDelete = async (id: number) => {
    await fetch(`/api/orders/${id}`, { method: 'DELETE' });
    setOrders((prev) => prev.filter((order) => order.id !== id));
  };

  const handleStatusChange = async (id: number, concluded: boolean) => {
    await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ concluded }),
    });
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, concluded } : order))
    );
  };

  return (
    <div >
      <Table>
        <TableHead>
        <TableRow >
            <TableCell>Pedido</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            
            <TableRow key={order.id}>
              <TableCell>Pedido #{order.id}</TableCell>
              <TableCell>R$ {order.totalPrice}</TableCell>
              <TableCell>
              <Badge
                  className={`rounded-full px-2 py-1 text-xs ${
                    order.concluded
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {order.concluded ? 'Concluído' : 'Pendente'}
                </Badge>
                
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Ver Items</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <h2>Items do Pedido #{order.id}</h2>
                    <ul>
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.quantity}x {item.item.name}
                        </li>
                      ))}
                    </ul>
                  </DialogContent>
                </Dialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">...</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleStatusChange(order.id, !order.concluded)}>
                      {order.concluded ? 'Marcar como Pendente' : 'Marcar como Concluído'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(order.id)} className="text-red-500">
                      Apagar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between mt-4">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Próximo
        </Button>
      </div>
    </div>
  );
};

export default OrderTable;
