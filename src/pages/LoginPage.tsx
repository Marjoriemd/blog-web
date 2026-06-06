import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login } from '../api/auth';
import { useAuth } from '../auth/AuthContext';
import { AxiosError } from 'axios';
import type { ApiError } from '../types';
import PasswordInput from '../components/PasswordInput';

function NavyPanel() {
  return (
    <div
      className="hidden lg:flex lg:w-7/12 relative overflow-hidden flex-col justify-between p-14"
      style={{ background: 'linear-gradient(145deg, #07091f 0%, #0d1240 45%, #131c5c 100%)' }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      />

      {/* Geometric circles */}
      <div className="absolute -top-[10%] -left-[10%] w-[45rem] h-[45rem] rounded-full pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, #1a2878 0%, #2b4ed4 100%)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }} />
      <div className="absolute -bottom-[15%] -right-[10%] w-[35rem] h-[35rem] rounded-full pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, #131c5c 0%, #1a2878 100%)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }} />

      {/* S-curve at left edge — blends into the white form panel */}
      <svg
        className="absolute left-0 top-0 h-full w-24 pointer-events-none"
        viewBox="0 0 80 900"
        preserveAspectRatio="none"
        fill="white"
      >
        <path d="M0,0 C60,75 60,150 0,225 C60,300 60,375 0,450 C60,525 60,600 0,675 C60,750 60,825 0,900 L0,900 L0,0 Z" />
      </svg>

      {/* Brand */}
      <div className="relative z-10 animate-fade-in pl-8">
        <span className="font-display font-700 text-white text-3xl tracking-tight">Blog</span>
      </div>

      {/* Main copy */}
      <div className="relative z-10 space-y-6 animate-fade-up delay-100 max-w-sm pl-16">
        <h2 className="font-display font-700 text-white leading-[1.05]" style={{ fontSize: 'clamp(3rem, 4.5vw, 4rem)' }}>
          Ideas que<br />conectan<br />personas.
        </h2>

      </div>
    </div>
  );
}

export default function LoginPage() {
  const { saveToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const registered = (location.state as { registered?: boolean })?.registered;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const tokens = await login(username, password);
      saveToken(tokens.access_token);
      navigate('/feed');
    } catch (err) {
      const axiosErr = err as AxiosError<ApiError>;
      setError(axiosErr.response?.data?.error?.message || 'Credenciales incorrectas. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  const inputBase =
    'w-full px-4 py-2.5 text-sm bg-white border border-pb-100 rounded-lg text-pb-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-pb-400/40 focus:border-pb-400 transition-all duration-150';

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Form panel */}
      <div className="w-full lg:w-5/12 flex items-center justify-center px-8 py-12 bg-white">
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
            <h1 className="font-display font-700 text-pb-900 text-3xl tracking-tight mb-2">
              Bienvenido de nuevo
            </h1>
            <p className="text-slate-400 text-sm">Inicia sesión para continuar en la comunidad</p>
          </div>

          {registered && (
            <div
              className="mb-6 flex items-start gap-3 px-4 py-3.5 rounded-xl border animate-scale-in"
              style={{ background: 'rgba(34,211,238,0.06)', borderColor: 'rgba(34,211,238,0.2)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#06b6d4' }}>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              <p className="text-sm" style={{ color: '#0891b2' }}>Cuenta creada. Ya puedes iniciar sesión.</p>
            </div>
          )}

          {error && (
            <div className="mb-6 flex items-start gap-3 px-4 py-3.5 rounded-xl bg-red-50 border border-red-100 animate-scale-in">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                className="w-4 h-4 shrink-0 mt-0.5 text-red-500">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-xs font-600 text-slate-500 uppercase tracking-wider mb-2">
                Usuario
              </label>
              <input
                id="username" type="text" value={username}
                onChange={e => setUsername(e.target.value)}
                required autoComplete="username" placeholder="tu_usuario"
                className={inputBase}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-600 text-slate-500 uppercase tracking-wider mb-2">
                Contraseña
              </label>
              <PasswordInput
                id="password" value={password}
                onChange={e => setPassword(e.target.value)}
                required autoComplete="current-password"
              />
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
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Iniciando sesión...
                  </span>
                ) : 'Iniciar sesión'}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="font-600 text-pb-500 hover:text-pb-400 transition-colors duration-150">
              Regístrate
            </Link>
          </p>
        </div>
      </div>

      <NavyPanel />
    </div>
  );
}
