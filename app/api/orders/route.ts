import { db } from "@/app/_lib/prisma"
import { NextResponse } from "next/server"


export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const pageSize = 5;
  const skip = (page - 1) * pageSize;

  const orders = await db.order.findMany({
    skip,
    take: pageSize,
    include: {
      items: {
        include: { item: true },
      },
    },
  });

  const totalCount = await db.order.count();

  return NextResponse.json({
    orders,
    totalPages: Math.ceil(totalCount / pageSize),
  });
}

