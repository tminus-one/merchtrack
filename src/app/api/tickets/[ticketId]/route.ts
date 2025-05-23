import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { processActionReturnData } from "@/utils";

export async function POST(req: NextRequest, params: Promise<{ params: { ticketId: string } }>) {
  const { params: { ticketId } } = await params;
  const { include, limitFields } = await req.json();

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: include,
    });

    if (!ticket) {
      return NextResponse.json({
        success: false,
        message: "Ticket not found"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: processActionReturnData(ticket, limitFields),   
    });
  } catch (error) { 
    return NextResponse.json({
      success: false,
      message: (error as Error).message
    }, { status: 500 });
  }
}