// Get product by slug from database

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { processActionReturnData } from "@/utils";
import { QueryParams } from "@/types/common";

export async function POST(
  req: NextRequest,
  params: Promise<{ params: { slug: string } }>
): Promise<NextResponse> {
  const { params: { slug } } = await params;
  const { include, limitFields } = await req.json() as QueryParams;

  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: include,
    });

    if (!product) {
      return NextResponse.json({
        success: false,
        message: "Product not found"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: processActionReturnData(product, limitFields),   
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: (error as Error).message
    }, { status: 500 });
  }
}