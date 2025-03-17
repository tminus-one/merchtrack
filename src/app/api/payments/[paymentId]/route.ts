import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { processActionReturnData } from "@/utils";

export async function POST(req: NextRequest, { params }: { params: { paymentId: string } }) {
  const { paymentId } = params;
  const { include, limitFields } = await req.json();

  try {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include,
    });

    if (!payment) {
      return NextResponse.json({
        success: false,
        message: "Payment not found"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: processActionReturnData(payment, limitFields),   
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: (error as Error).message
    }, { status: 500 });
  }
}