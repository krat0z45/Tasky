// app/profile/[id]/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "../../../lib/db";
import PublicProfileClient from "./PublicProfileClient";

// Recuerda que en Next.js 15 los params son una Promesa
export default async function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const targetUserId = resolvedParams.id;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  // Usuario que está navegando
  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!currentUser) redirect("/login");

  // Usuario del que queremos ver el perfil
  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { 
      id: true, 
      name: true, 
      email: true, 
      image: true, 
      createdAt: true 
    }
  });

  // Si manipulan la URL y ponen un ID que no existe
  if (!targetUser) redirect("/dashboard");

  const isOwnProfile = currentUser.id === targetUser.id;

  return (
    <PublicProfileClient 
      targetUser={targetUser} 
      currentUser={currentUser} 
      isOwnProfile={isOwnProfile} 
    />
  );
}