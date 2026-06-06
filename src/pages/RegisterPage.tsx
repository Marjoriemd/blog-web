import { useState, type FormEvent, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import { AxiosError } from 'axios';
import type { ApiError } from '../types';
import PasswordInput from '../components/PasswordInput';

function NavyPanel() {
  return (
    <div
      className="hidden lg:flex lg:w-5/12 relative overflow-hidden flex-col justify-between p-12"
      style={{ background: 'linear-gradient(145deg, #07091f 0%, #0d1240 45%, #131c5c 100%)' }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      />

      {/* Geometric circles */}
      <div className="absolute -top-[10%] -right-[20%] w-[45rem] h-[45rem] rounded-full pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, #1a2878 0%, #2b4ed4 100%)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }} />
      <div className="absolute -bottom-[15%] -left-[10%] w-[35rem] h-[35rem] rounded-full pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, #131c5c 0%, #1a2878 100%)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }} />

      {/* S-curve at right edge — blends into the white form panel */}
      <svg
        className="absolute right-0 top-0 h-full w-24 pointer-events-none"
        viewBox="0 0 80 900"
        preserveAspectRatio="none"
        fill="white"
      >
        <path d="M80,0 C20,75 20,150 80,225 C20,300 20,375 80,450 C20,525 20,600 80,675 C20,750 20,825 80,900 L80,900 L80,0 Z" />
      </svg>

      {/* Brand */}
      <div className="relative z-10 animate-fade-in pl-8">
        <span className="font-display font-700 text-white text-3xl tracking-tight">Blog</span>
      </div>

      {/* Main copy */}
      <div className="relative z-10 space-y-5 animate-fade-up delay-100 my-auto lg:pl-16">
        <h2 className="font-display font-700 text-white leading-[1.1]" style={{ fontSize: 'clamp(3rem, 4.5vw, 4rem)' }}>
          Comienza tu<br />historia hoy.
        </h2>
        <p className="text-pb-100 text-lg leading-relaxed max-w-[280px]">
          Crea tu cuenta y empieza a compartir tus ideas.
        </p>
      </div>

    </div>
  );
}

interface FormState {
  name: string;
  email: string;
  username: string;
  password: string;
  avatar: string;
}

const initialForm: FormState = { name: '', email: '', username: '', password: '', avatar: '' };

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(initialForm);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
    if (name === 'avatar' && value.startsWith('http')) {
      setAvatarPreview(value);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setForm(prev => ({ ...prev, avatar: base64 }));
      setAvatarPreview(base64);
    };
    reader.readAsDataURL(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setForm(prev => ({ ...prev, avatar: base64 }));
      setAvatarPreview(base64);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);
    try {
      await register(form);
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      const axiosErr = err as AxiosError<ApiError>;
      const apiErr = axiosErr.response?.data?.error;
      if (apiErr?.details) {
        const mapped: Record<string, string> = {};
        apiErr.details.forEach(d => { mapped[d.field] = d.message; });
        setFieldErrors(mapped);
      } else {
        setError(apiErr?.message || 'Error al crear la cuenta');
      }
    } finally {
      setLoading(false);
    }
  }

  const inputClass = (field: string) =>
    `w-full pl-10 pr-4 py-2.5 text-sm bg-white border rounded-lg text-pb-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-150 ${fieldErrors[field]
      ? 'border-red-300 focus:ring-red-400/40'
      : 'border-pb-100 focus:ring-pb-400/40 focus:border-pb-400'
    }`;

  const fieldIcon = 'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400';

  return (
    <div className="min-h-screen flex bg-surface">
      <NavyPanel />

      {/* Form panel */}
      <div className="w-full lg:w-7/12 flex items-center justify-center px-8 py-10 bg-white overflow-y-auto">
        <div className="w-full max-w-sm animate-fade-up">

          {/* Mobile brand */}
          <div className="lg:hidden mb-10 flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #131c5c 0%, #2b4ed4 100%)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
              </svg>
            </div>
            <span className="font-display font-700 text-pb-900 text-lg">Blog</span>
          </div>

          <div className="mb-8">
            <h1 className="font-display font-700 text-pb-900 text-3xl tracking-tight mb-2">Crear cuenta</h1>
            <p className="text-slate-400 text-sm">Completa los datos para unirte a la comunidad</p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-3 px-4 py-3.5 rounded-xl bg-red-50 border border-red-100 animate-scale-in">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                className="w-4 h-4 shrink-0 mt-0.5 text-red-500">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-600 text-slate-500 uppercase tracking-wider mb-2">
                Nombre completo
              </label>
              <div className="relative">
                <div className={fieldIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input id="name" name="name" type="text" value={form.name} onChange={handleChange}
                  required placeholder="Juan Pérez" className={inputClass('name')} />
              </div>
              {fieldErrors.name && <p className="mt-1.5 text-xs text-red-500">{fieldErrors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-600 text-slate-500 uppercase tracking-wider mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <div className={fieldIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input id="email" name="email" type="email" value={form.email} onChange={handleChange}
                  required placeholder="juan@ejemplo.com" className={inputClass('email')} />
              </div>
              {fieldErrors.email && <p className="mt-1.5 text-xs text-red-500">{fieldErrors.email}</p>}
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-xs font-600 text-slate-500 uppercase tracking-wider mb-2">
                Nombre de usuario
              </label>
              <div className="relative">
                <div className={fieldIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />
                  </svg>
                </div>
                <input id="username" name="username" type="text" value={form.username} onChange={handleChange}
                  required placeholder="juanperez" className={inputClass('username')} />
              </div>
              {fieldErrors.username && <p className="mt-1.5 text-xs text-red-500">{fieldErrors.username}</p>}
            </div>

            {/* Avatar */}
            <div>
              <label className="block text-xs font-600 text-slate-500 uppercase tracking-wider mb-2">
                Foto de perfil (opcional)
              </label>
              <div
                className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors ${fieldErrors.avatar ? 'border-red-300' : 'border-pb-100 hover:border-pb-300'}`}
                onDragOver={e => e.preventDefault()}
                onDrop={handleDrop}
              >
                {avatarPreview ? (
                  <div className="flex flex-col items-center gap-2">
                    <img src={avatarPreview} alt="Preview" className="w-14 h-14 rounded-full object-cover border-2 border-pb-100" />
                    <button
                      type="button"
                      onClick={() => { setAvatarPreview(null); setForm(p => ({ ...p, avatar: '' })); }}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Quitar imagen
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 py-1">
                    <svg className="w-7 h-7 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-slate-400">
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="text-pb-500 font-500 hover:underline">
                        Sube un archivo
                      </button>{' '}
                      o arrastra una imagen
                    </p>
                    <p className="text-xs text-slate-300">O pega una URL abajo</p>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
              </div>
              <div className="relative mt-2">
                <div className={fieldIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <input id="avatar" name="avatar" type="url" value={form.avatar} onChange={handleChange}
                  placeholder="https://ejemplo.com/foto.png" className={inputClass('avatar')} />
              </div>
              {fieldErrors.avatar && <p className="mt-1.5 text-xs text-red-500">{fieldErrors.avatar}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-600 text-slate-500 uppercase tracking-wider mb-2">
                Contraseña
              </label>
              <PasswordInput
                id="password" name="password" value={form.password}
                onChange={handleChange} required hasError={!!fieldErrors.password}
                showStrengthBar
              />
              {fieldErrors.password && <p className="mt-1.5 text-xs text-red-500">{fieldErrors.password}</p>}
              <p className="mt-1.5 text-xs text-slate-400">Mínimo 8 caracteres, una mayúscula y un número.</p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 text-sm font-600 text-white rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pb-400/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #1a2878 0%, #2b4ed4 100%)',
                  boxShadow: '0 4px 14px rgba(32,53,168,0.35)',
                }}
              >
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-600 text-pb-500 hover:text-pb-400 transition-colors duration-150">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
