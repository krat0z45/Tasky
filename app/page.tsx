// app/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import { redirect } from "next/navigation";
import LandingClient from "./components/LandingClient";

export default async function HomePage() {
  // 1. Verificamos la sesión antes de enviar nada al navegador
  const session = await getServerSession(authOptions);

  // 2. Si el usuario está logueado, lo mandamos directo al dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  // 3. Si no tiene sesión, entonces sí le mostramos tu Landing Page con animaciones
  return <LandingClient />;
}