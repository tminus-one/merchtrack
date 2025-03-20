import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(): Promise<NextResponse> {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
          },
        },
      },
    });
    
    if (!categories || categories.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No categories found",
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: (error as Error).message,
    }, { status: 500 });
  }
}