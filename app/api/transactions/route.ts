import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import type { Transaction } from "@/lib/stores/transactions";

/**
 * GET /api/transactions
 * Fetch transactions with optional filtering
 * 
 * Query params:
 * - storeId: Filter by store
 * - branchId: Filter by branch
 * 
 * Examples:
 * - /api/transactions (get all)
 * - /api/transactions?storeId=daily-dope (all transactions for Daily Dope)
 * - /api/transactions?storeId=daily-dope&branchId=vicas (only Vicas branch)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const storeId = searchParams.get("storeId");
    const branchId = searchParams.get("branchId");

    // Build MongoDB filter
    const filter: any = {};
    if (storeId) filter.storeId = storeId;
    if (branchId) filter.branchId = branchId;

    const collection = await getCollection<Transaction>("transactions");
    const transactions = await collection
      .find(filter)
      .sort({ timestamp: -1 }) // Most recent first
      .toArray();

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/transactions
 * Create a new transaction
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Generate transaction ID
    const id = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const transaction: Transaction = {
      ...body,
      id,
      timestamp: Date.now(),
      status: "completed",
    };

    const collection = await getCollection<Transaction>("transactions");
    await collection.insertOne(transaction as any);

    return NextResponse.json({ transaction }, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
