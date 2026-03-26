// app/api/tasks/reorder/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth"; // Verifica que la ruta a lib/auth sea correcta
import { prisma } from "../../../../lib/db"; // Verifica que la ruta a lib/db sea correcta

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return new NextResponse("No autorizado", { status: 401 });

    const { tasks } = await request.json();

    // Actualizamos el orden y la columna de todas las tareas afectadas en una sola transacción
    await prisma.$transaction(
      tasks.map((task: any) =>
        prisma.task.update({
          where: { id: task.id },
          data: { columnId: task.columnId, order: task.order }
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reordenando:", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}