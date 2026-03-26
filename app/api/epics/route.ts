// app/api/epics/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/db";

// CREAR ÉPICA
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return new NextResponse("No autorizado", { status: 401 });

    const body = await request.json();
    const { name, taskyspaceId } = body;

    if (!name || !taskyspaceId) return new NextResponse("Faltan datos", { status: 400 });

    const epic = await prisma.epic.create({
      data: { name, taskyspaceId }
    });
    
    return NextResponse.json(epic);
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}

// ELIMINAR ÉPICA
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return new NextResponse("No autorizado", { status: 401 });

    const { searchParams } = new URL(request.url);
    const epicId = searchParams.get("epicId");

    if (!epicId) return new NextResponse("Falta ID", { status: 400 });

    await prisma.epic.delete({
      where: { id: epicId }
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}