import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import type { Transaction } from "@/lib/stores/transactions";

/**
 * PATCH /api/transactions/:id
 * Void a transaction
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { reason } = body;

    const collection = await getCollection<Transaction>("transactions");
    
    const result = await collection.updateOne(
      { id },
      {
        $set: {
          status: "voided",
          voidedAt: Date.now(),
          ...(reason && { voidReason: reason }),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error voiding transaction:", error);
    return NextResponse.json(
      { error: "Failed to void transaction" },
      { status: 500 }
    );
  }
}

