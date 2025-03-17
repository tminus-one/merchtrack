import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { QueryParams } from "@/types/common";
import { processActionReturnData } from "@/utils";

export async function POST(req:NextRequest) {
  try {
    const params: QueryParams = await req.json();
    const { take, skip, where, include, orderBy, limitFields } = params;
    const tickets = await prisma.ticket.findMany({
      take: take ? Number(take) : 10,
      skip: skip ? Number(skip) : 0,
      where,
      include,
      orderBy,
    });

    const total = await prisma.ticket.count({ where });

    return NextResponse.json({
      success: true,
      data: processActionReturnData(tickets, limitFields),
      metadata: {
        total,
        page: params.page ?? 1,
        lastPage: Math.ceil(total / (params.limit ?? 10)),
        hasNextPage: (params.page ?? 1) < Math.ceil(total / (params.limit ?? 10)),
        hasPrevPage: (params.page ?? 1) > 1
      }
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: (error as Error).message
    }, { status: 500 });
  }
};