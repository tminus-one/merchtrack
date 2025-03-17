import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { processActionReturnData } from "@/utils";

export async function POST(req: NextRequest, params: Promise<{ params: { userId: string } }>) {
  const { params: { userId } } = await params;
  const { include, limitFields } = await req.json();

  try {
    const user = await prisma.cart.findFirst({
      where: {
        userId
      },
      include,
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: processActionReturnData(user, limitFields),   
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: (error as Error).message
    }, { status: 500 });
  }
}