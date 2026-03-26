// app/components/AuthLoadingOverlay.tsx
import React from 'react';
import { ShieldCheck, Lock, CheckCircle } from 'lucide-react';

export default function AuthLoadingOverlay() {
  return (
    // Fondo oscuro con desenfoque de fondo (backdrop-blur)
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#111417]/90 backdrop-blur-sm animate-in fade-in duration-300">
      
      {/* Contenedor principal con efecto neón suave */}
      <div className="p-10 rounded-3xl bg-[#161a1d] border border-[#30363d] shadow-[0_0_60px_rgba(16,185,129,0.1)] flex flex-col items-center gap-8 relative overflow-hidden">
        
        {/* Resplandor de fondo animado */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none"></div>

        {/* --- Spinner de Seguridad Avanzado --- */}
        <div className="relative flex items-center justify-center w-32 h-32">
          
          {/* Anillo externo (Cian) - Gira lento */}
          <div className="absolute inset-0 rounded-full border-4 border-dashed border-cyan-800 animate-[spin_10s_linear_infinite]"></div>
          
          {/* Anillo medio (Esmeralda) - Gira rápido */}
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-emerald-500 animate-[spin_1.5s_linear_infinite]"></div>
          
          {/* Anillo interno (Esmeralda oscuro) - Gira inverso */}
          <div className="absolute inset-5 rounded-full border-2 border-transparent border-b-emerald-800 animate-[spin_1s_linear_infinite_reverse]"></div>
          
          {/* Ícono central con pulso de seguridad */}
          <div className="relative z-10 p-4 rounded-full bg-[#1d2125] border border-[#30363d] text-emerald-400 animate-pulse">
            <ShieldCheck size={48} strokeWidth={1.5} />
          </div>
        </div>

        {/* --- Textos de Estado --- */}
        <div className="text-center space-y-3 z-10 relative">
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center justify-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Estableciendo conexión segura
          </h2>
          
          {/* Lista de pasos de "verificación" falsa para UX */}
          <div className="pt-4 space-y-2 text-sm text-gray-500">
            <div className="flex items-center gap-2.5 opacity-60">
              <CheckCircle size={16} className="text-emerald-600"/> Validando identidad con Google OAuth
            </div>
            <div className="flex items-center gap-2.5 animate-pulse text-emerald-400">
              <Lock size={16}/> Creando túnel de sesión encriptado
            </div>
            <div className="flex items-center gap-2.5 opacity-20">
              <div className="w-3.5 h-3.5 rounded-full bg-gray-700"></div> Redirigiendo al Dashboard
            </div>
          </div>
        </div>
      </div>
      
      {/* Estilos CSS para los spins personalizados si Tailwind no los tiene por defecto */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin_linear { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin_linear 10s linear infinite; }
      `}} />
    </div>
  );
}