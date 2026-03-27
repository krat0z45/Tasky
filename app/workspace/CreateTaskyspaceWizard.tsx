// app/workspace/CreateTaskyspaceWizard.tsx
'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Target, X, Code, KanbanSquare, ArrowRight, Lock, Unlock, Zap, Plus, GripVertical, Trash2, Edit2, Check, Rocket, ListTodo } from 'lucide-react';

interface CreateTaskyspaceWizardProps {
  onClose: () => void;
  user: { name?: string | null };
}

const defaultStatuses = [
  { id: 1, name: 'Por Hacer', color: 'bg-gray-600' },
  { id: 2, name: 'En Curso', color: 'bg-cyan-600' },
  { id: 3, name: 'En Revisión', color: 'bg-yellow-600' },
  { id: 4, name: 'Listo', color: 'bg-green-600' },
];

const defaultActivities = [
  { id: 1, name: 'Configurar repositorio y base de datos' },
  { id: 2, name: 'Diseñar la pantalla de autenticación' },
  { id: 3, name: 'Definir arquitectura de la API' },
];

export default function CreateTaskyspaceWizard({ onClose, user }: CreateTaskyspaceWizardProps) {
  const router = useRouter(); 
  const [isLoading, setIsLoading] = useState(false); 
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    template: 'Desarrollo de Software', 
    projectType: 'Scrum', 
    name: '',
    privacy: 'Abierto' as 'Abierto' | 'Privado',
    password: '',
    activities: defaultActivities,
    statuses: defaultStatuses,
    invitations: [] as { email: string; role: string; name?: string }[]
  });

  const steps = [
    { title: 'Selecciona una plantilla', desc: 'Tasky viene con flujos de trabajo predefinidos.' },
    { title: 'Resumen de la plantilla', desc: 'Explora todo el poder de tu nuevo espacio Ágil.' },
    { title: 'Detalles del Proyecto', desc: 'Démosle nombre y seguridad a tu espacio.' },
    { title: 'Alimenta tu Backlog inicial', desc: 'Añade las primeras ideas o tareas pendientes.' },
    { title: 'Configura tus estados', desc: 'Define las columnas de tu Tablero activo.' },
    { title: 'Invita a tu equipo', desc: 'Asigna roles y empieza a colaborar.' },
    { title: '¡Todo listo!', desc: 'Tu nuevo ecosistema de trabajo está por nacer.' },
  ];

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 7));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleFinish = async () => {
    setIsLoading(true); 
    try {
      const payload = {
        name: formData.name,
        privacy: formData.privacy,
        password: formData.privacy === 'Privado' ? formData.password : null,
        includeTasks: true,
        customTasks: formData.activities.map(a => a.name),
        customStatuses: formData.statuses.map(s => ({ name: s.name, color: s.color })),
        invitations: formData.invitations 
      };

      const response = await fetch('/api/taskyspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        onClose(); 
        router.refresh(); 
      } else {
        const errorText = await response.text(); 
        alert(`Ocurrió un error al crear el espacio: ${errorText}`); 
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión. Revisa tu internet o la consola."); 
    } finally {
      setIsLoading(false); 
    }
  };

  const Step1Templates = () => (
    <div className="space-y-4 pt-4">
      <div className="bg-[#22272b] p-6 rounded-xl border-2 border-emerald-500 flex gap-5 items-start cursor-pointer shadow-lg shadow-emerald-900/10 relative">
        <div className="absolute top-4 right-4 bg-emerald-950 text-emerald-400 text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider">Seleccionado</div>
        <div className="bg-[#1d2125] p-3 rounded-lg border border-[#30363d] text-emerald-400">
          <Code className="w-8 h-8" />
        </div>
        <div>
          <h4 className="text-xl font-bold text-white">Desarrollo de Software (Agile)</h4>
          <p className="mt-1 text-sm text-gray-400 leading-relaxed">Framework completo tipo Jira. Incluye gestión de Backlog, Sprints, Épicas con etiquetas Neón, Tablero Kanban activo y un Dashboard de Resumen con métricas de esfuerzo y velocidad.</p>
        </div>
      </div>
      <div className="bg-[#161a1d] p-6 rounded-xl border border-[#30363d] opacity-50 flex gap-5 items-start">
        <div className="bg-[#1d2125] p-3 rounded-lg border border-[#30363d] text-gray-500">
          <Zap className="w-8 h-8" />
        </div>
        <div>
          <h4 className="text-xl font-bold text-gray-400">Gestión de Tareas Simples (Pronto)</h4>
          <p className="mt-1 text-sm text-gray-500">Para seguimiento de actividades lineales no relacionadas con software.</p>
        </div>
      </div>
    </div>
  );

  const Step2KanbanSummary = () => (
    <div className="space-y-6 pt-4">
      <div className="bg-[#22272b] p-6 rounded-xl border border-[#30363d] flex gap-5 items-center">
        <div className="bg-[#1d2125] p-3 rounded-lg border border-[#30363d] text-emerald-400">
          <ListTodo className="w-8 h-8" />
        </div>
        <div>
          <h4 className="text-xl font-bold text-white">Flujo de Trabajo Scrum</h4>
          <p className="mt-1 text-sm text-gray-400">Planifica en el Backlog, arrastra a Sprints y ejecuta en el Tablero.</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <h5 className="font-semibold text-white">¿Qué incluye tu nuevo entorno?</h5>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-[#161a1d] p-4 rounded-lg border border-[#30363d]">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Organización</span>
            <p className="mt-1 text-white flex items-center gap-1.5"><Zap size={14} className="text-emerald-400"/> Épicas, Sprints y Tareas</p>
          </div>
          <div className="bg-[#161a1d] p-4 rounded-lg border border-[#30363d]">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Flujo Activo</span>
            <p className="mt-1 text-white flex items-center gap-1.5"><ArrowRight size={14} className="text-emerald-400"/> {defaultStatuses.map(s => s.name).join(', ')}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const Step3Details = () => (
    <div className="space-y-6 pt-4">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1.5">Nombre del Proyecto *</label>
        <input 
          type="text" 
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
          placeholder="Ej. Nube Digital v2.0" 
          className="w-full bg-[#22272b] border border-[#30363d] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2">
        <button 
          onClick={() => setFormData(prev => ({ ...prev, privacy: 'Abierto', password: '' }))}
          className={`p-5 rounded-xl border-2 flex flex-col gap-2 items-center text-center transition-all ${
            formData.privacy === 'Abierto' ? 'bg-[#22272b] border-emerald-500 shadow-emerald-900/10 shadow-lg' : 'bg-[#161a1d] border-[#30363d] hover:border-[#424c58]'
          }`}
        >
          <Unlock className={`w-8 h-8 ${formData.privacy === 'Abierto' ? 'text-emerald-400' : 'text-gray-500'}`} />
          <h5 className="font-semibold text-white">Público</h5>
          <p className="text-xs text-gray-400 leading-tight">Cualquiera con el enlace o invitación puede acceder.</p>
        </button>
        
        <button 
          onClick={() => setFormData(prev => ({ ...prev, privacy: 'Privado' }))}
          className={`p-5 rounded-xl border-2 flex flex-col gap-2 items-center text-center transition-all ${
            formData.privacy === 'Privado' ? 'bg-[#22272b] border-emerald-500 shadow-emerald-900/10 shadow-lg' : 'bg-[#161a1d] border-[#30363d] hover:border-[#424c58]'
          }`}
        >
          <Lock className={`w-8 h-8 ${formData.privacy === 'Privado' ? 'text-emerald-400' : 'text-gray-500'}`} />
          <h5 className="font-semibold text-white">Privado (Seguro)</h5>
          <p className="text-xs text-gray-400 leading-tight">Protegido por contraseña. Ideal para datos sensibles.</p>
        </button>
      </div>

      {formData.privacy === 'Privado' && (
        <div className="animate-in fade-in zoom-in-95 duration-200">
          <label className="block text-sm font-medium text-gray-400 mb-1.5 flex items-center gap-2">Contraseña de acceso <Lock size={14}/></label>
          <input 
            type="password" 
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            placeholder="Establece una contraseña segura" 
            className="w-full bg-[#22272b] border border-emerald-500/50 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-[0_0_10px_rgba(16,185,129,0.1)]"
          />
          <p className="text-xs text-gray-500 mt-1.5">Los usuarios que invites necesitarán esta clave para entrar al tablero.</p>
        </div>
      )}
    </div>
  );

  const Step4Activities = () => {
    const [newActivityName, setNewActivityName] = useState('');

    const addActivity = () => {
      if (newActivityName.trim()) {
        const newId = Date.now();
        setFormData(prev => ({ ...prev, activities: [...prev.activities, { id: newId, name: newActivityName.trim() }] }));
        setNewActivityName('');
      }
    };

    const removeActivity = (id: number) => {
      setFormData(prev => ({ ...prev, activities: prev.activities.filter(act => act.id !== id) }));
    };

    return (
      <div className="space-y-6 pt-4">
        <div className="flex gap-3">
          <input 
            type="text" 
            value={newActivityName}
            onChange={(e) => setNewActivityName(e.target.value)}
            onKeyDown={(e) => { if(e.key === 'Enter') addActivity(); }}
            placeholder="Ej. Configurar base de datos inicial" 
            className="flex-1 bg-[#161a1d] border border-[#30363d] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
          />
          <button onClick={addActivity} className="flex items-center gap-1.5 bg-[#2c333b] hover:bg-[#3d444d] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-[#30363d]">
            <Plus size={16} /> Añadir
          </button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          {formData.activities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-[#22272b] rounded-lg border border-[#30363d] group">
              <span className="text-sm text-white flex items-center gap-2"><Target size={14} className="text-emerald-400"/> {activity.name}</span>
              <button onClick={() => removeActivity(activity.id)} className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {formData.activities.length === 0 && <p className="text-center text-sm text-gray-500 pt-10">Tu Backlog empezará completamente vacío.</p>}
        </div>
      </div>
    );
  };

  const Step5Statuses = () => {
    const [newStatusName, setNewStatusName] = useState('');
    const [editingStatusId, setEditingStatusId] = useState<number | null>(null);
    const [editingStatusName, setEditingStatusName] = useState('');

    const addStatus = () => {
      if (newStatusName.trim()) {
        const newId = Date.now();
        setFormData(prev => ({ ...prev, statuses: [...prev.statuses, { id: newId, name: newStatusName.trim(), color: 'bg-gray-600' }] }));
        setNewStatusName('');
      }
    };

    const removeStatus = (id: number) => setFormData(prev => ({ ...prev, statuses: prev.statuses.filter(s => s.id !== id) }));
    const startEditing = (id: number, name: string) => { setEditingStatusId(id); setEditingStatusName(name); };
    
    const saveEditing = (id: number) => {
      if (editingStatusName.trim()) setFormData(prev => ({ ...prev, statuses: prev.statuses.map(s => s.id === id ? { ...s, name: editingStatusName.trim() } : s) }));
      setEditingStatusId(null);
    };

    const moveStatus = (index: number, direction: 'up' | 'down') => {
      const newStatuses = [...formData.statuses];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newStatuses.length) return;
      [newStatuses[index], newStatuses[targetIndex]] = [newStatuses[targetIndex], newStatuses[index]];
      setFormData(prev => ({ ...prev, statuses: newStatuses }));
    };

    return (
      <div className="space-y-6 pt-4">
        <div className="flex gap-3">
          <input 
            type="text" 
            value={newStatusName}
            onChange={(e) => setNewStatusName(e.target.value)}
            onKeyDown={(e) => { if(e.key === 'Enter') addStatus(); }}
            placeholder="Añade una nueva columna (Ej. En Pruebas (QA))" 
            className="flex-1 bg-[#161a1d] border border-[#30363d] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
          />
          <button onClick={addStatus} className="flex items-center gap-1.5 bg-[#2c333b] hover:bg-[#3d444d] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-[#30363d]">
            <Plus size={16} /> Columna
          </button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          {formData.statuses.map((status, index) => (
            <div key={status.id} className="flex items-center gap-3 p-3 bg-[#22272b] rounded-lg border border-[#30363d] group">
              <div className={`w-1 h-6 rounded-full ${status.color}`}></div>
              
              {editingStatusId === status.id ? (
                <input type="text" value={editingStatusName} onChange={(e) => setEditingStatusName(e.target.value)} className="flex-1 bg-[#1d2125] border border-emerald-500 rounded px-2 py-0.5 text-sm text-white focus:outline-none" onBlur={() => saveEditing(status.id)} autoFocus />
              ) : (
                <span className="flex-1 text-sm text-white font-medium">{status.name}</span>
              )}

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all text-gray-500">
                {editingStatusId === status.id ? (
                  <button onClick={() => saveEditing(status.id)} className="hover:text-emerald-400 p-1"><Check size={16}/></button>
                ) : (
                  <button onClick={() => startEditing(status.id, status.name)} className="hover:text-emerald-400 p-1"><Edit2 size={16}/></button>
                )}
                <button onClick={() => removeStatus(status.id)} className="hover:text-red-400 p-1"><Trash2 size={16}/></button>
                <div className="flex flex-col gap-0.5 ml-1">
                  <button onClick={() => moveStatus(index, 'up')} disabled={index === 0} className="hover:text-white disabled:opacity-30 disabled:hover:text-gray-500">▲</button>
                  <button onClick={() => moveStatus(index, 'down')} disabled={index === formData.statuses.length - 1} className="hover:text-white disabled:opacity-30 disabled:hover:text-gray-500">▼</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const Step6Team = () => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Miembro');
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState('');

    const addInvitation = async () => {
      setSearchError('');
      const trimmedEmail = email.trim();
      if (!trimmedEmail || !trimmedEmail.includes('@')) { setSearchError('Introduce un correo válido.'); return; }
      if (formData.invitations.some(inv => inv.email === trimmedEmail)) { setSearchError('Ya invitado.'); return; }

      setIsSearching(true);
      try {
        const res = await fetch(`/api/users/search?email=${encodeURIComponent(trimmedEmail)}`);
        const data = await res.json();
        if (data.isSelf) { setSearchError('Ya eres el dueño de este espacio.'); } 
        else if (data.found) { setFormData(prev => ({ ...prev, invitations: [...prev.invitations, { email: data.user.email, role, name: data.user.name }] })); setEmail(''); } 
        else { setSearchError('Usuario no encontrado en Tasky.'); }
      } catch (error) { setSearchError('Error al buscar al usuario.'); } 
      finally { setIsSearching(false); }
    };

    const removeInvitation = (emailToRemove: string) => setFormData(prev => ({ ...prev, invitations: prev.invitations.filter(inv => inv.email !== emailToRemove) }));

    return (
      <div className="space-y-6 pt-4">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-400">Busca a un usuario de Tasky por correo *</label>
          <div className="flex gap-3">
            <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setSearchError(''); }} placeholder="Ej. compañero@empresa.com" className="flex-1 bg-[#161a1d] border border-[#30363d] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"/>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="bg-[#161a1d] border border-[#30363d] text-sm text-white rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500 transition-all">
              <option value="Miembro">Miembro</option>
              <option value="Administrador">Administrador</option>
              <option value="Solo Visor">Solo Visor</option>
            </select>
            <button onClick={addInvitation} disabled={isSearching} className="flex items-center gap-1.5 bg-[#2c333b] hover:bg-[#3d444d] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-[#30363d] disabled:opacity-50">
              {isSearching ? 'Buscando...' : <><Plus size={16} /> Invitar</>}
            </button>
          </div>
          {searchError && <p className="text-xs text-red-400">{searchError}</p>}
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
          {formData.invitations.map((inv: any) => (
            <div key={inv.email} className="flex items-center gap-4 p-3 bg-[#22272b] rounded-lg border border-[#30363d] border-l-2 border-l-emerald-500">
              <div className="w-9 h-9 rounded-full bg-[#161a1d] border border-[#30363d] flex items-center justify-center text-emerald-400 font-bold">{(inv.name || inv.email).charAt(0).toUpperCase()}</div>
              <div className="flex-1">
                <span className="text-sm text-white font-medium block">{inv.name || 'Usuario Tasky'}</span>
                <span className="text-xs text-gray-400">{inv.email}</span>
                <span className="text-xs text-emerald-400 ml-2 bg-emerald-900/30 px-2 py-0.5 rounded">{inv.role}</span>
              </div>
              <button onClick={() => removeInvitation(inv.email)} className="text-gray-500 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
            </div>
          ))}
          {formData.invitations.length === 0 && <p className="text-center text-sm text-gray-500 pt-10">Ningún usuario invitado.</p>}
        </div>
      </div>
    );
  };

  const Step7Final = () => (
    <div className="space-y-6 pt-4 text-center flex flex-col items-center">
      <div className="bg-[#2c333b] p-5 rounded-3xl border-2 border-dashed border-emerald-800 mb-6 shadow-emerald-900/10 shadow-xl relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none"></div>
         <Rocket className="w-16 h-16 text-emerald-400 relative z-10" />
      </div>
      <h3 className="text-3xl font-extrabold text-white leading-tight">
        El ecosistema <span className="text-emerald-400">"{formData.name || 'Sin nombre'}"</span> está listo.
      </h3>
      <p className="mt-4 text-lg text-gray-400 max-w-lg leading-relaxed">
        Se generará un entorno Ágil con <span className="text-white font-bold">{formData.statuses.length} columnas</span>, un Backlog preparado con <span className="text-white font-bold">{formData.activities.length} tickets</span>, y acceso <span className="text-white font-bold">{formData.privacy}</span>.
      </p>
    </div>
  );


  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return Step1Templates(); 
      case 2: return Step2KanbanSummary();
      case 3: return Step3Details();
      case 4: return Step4Activities();
      case 5: return Step5Statuses();
      case 6: return Step6Team();
      case 7: return Step7Final();
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000]/70 flex items-center justify-center z-[100] p-4 transition-all duration-300">
      <div className="w-full max-w-3xl bg-[#1d2125] border border-[#30363d] rounded-2xl p-8 shadow-2xl relative flex flex-col h-[700px] transition-all">
        
        <div className="flex justify-between items-start mb-8 border-b border-[#30363d] pb-6">
          <div className="flex-1 pr-6">
            <p className="text-xs text-emerald-400 uppercase font-bold tracking-wider mb-1">Paso {currentStep} de 7</p>
            <h2 className="text-3xl font-extrabold text-white">{steps[currentStep-1].title}</h2>
            <p className="text-sm text-gray-400 mt-1">{steps[currentStep-1].desc}</p>
          </div>
          <button onClick={onClose} disabled={isLoading} className="text-gray-500 hover:text-white transition-colors disabled:opacity-50"><X className="w-6 h-6" /></button>
        </div>

        <div className="flex-1 overflow-y-auto pr-3 custom-scrollbar">
          {renderStepContent()}
        </div>

        <div className="flex justify-between items-center mt-8 border-t border-[#30363d] pt-6 relative z-10">
          <button onClick={prevStep} disabled={currentStep === 1 || isLoading} className="text-sm text-gray-400 hover:text-white font-medium transition-colors disabled:opacity-30 disabled:hover:text-gray-500">
            Anterior
          </button>
          <div className="flex gap-4">
            <button onClick={onClose} disabled={isLoading} className="text-sm bg-[#2c333b] hover:bg-[#3d444d] text-white px-5 py-2.5 rounded-lg font-medium transition-colors border border-[#30363d] disabled:opacity-50">
              Cancelar
            </button>
            {currentStep < 7 ? (
              <button onClick={nextStep} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 px-6 py-2.5 rounded-lg font-bold transition-transform hover:-translate-y-0.5 shadow-md shadow-emerald-900/20">
                Siguiente
              </button>
            ) : (
              <button onClick={handleFinish} disabled={isLoading || !formData.name} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 px-6 py-2.5 rounded-lg font-bold transition-transform hover:-translate-y-0.5 shadow-md shadow-emerald-900/20 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed">
                 <Rocket size={18} className={isLoading ? "animate-bounce" : ""} /> 
                 {isLoading ? 'Creando...' : 'Crear Taskyspace'}
              </button>
            )}
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #30363d; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4b5563; }
      `}} />
    </div>
  );
}