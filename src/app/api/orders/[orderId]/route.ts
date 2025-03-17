import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { processActionReturnData } from "@/utils";

export async function POST(req: NextRequest, { params }: { params: { orderId: string } }) {
  const { orderId } = params;
  const { include, limitFields } = await req.json();
    
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: include,
    });
    
    if (!order) {
      return NextResponse.json({
        success: false,
        message: "Order not found"
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: processActionReturnData(order, limitFields),   
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: (error as Error).message
    }, { status: 500 });
  }
}