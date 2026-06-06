import { useState, type FormEvent } from 'react';
import { changePassword } from '../api/auth';
import { AxiosError } from 'axios';
import type { ApiError } from '../types';
import PasswordInput from '../components/PasswordInput';

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordsMatch = confirmPassword.length === 0 || newPassword === confirmPassword;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }

    setLoading(true);
    try {
      const res = await changePassword(currentPassword, newPassword);
      setMessage(res.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const axiosErr = err as AxiosError<ApiError>;
      setError(axiosErr.response?.data?.error?.message || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-700 text-pb-900 text-xl tracking-tight">Cambiar contraseña</h1>
        <p className="text-sm text-slate-400 mt-1">Actualiza la contraseña de tu cuenta</p>
      </div>

      <div
        className="bg-white border border-pb-50 rounded-2xl p-6"
        style={{ boxShadow: '0 2px 8px rgba(7,9,31,0.07)' }}
      >
        {message && (
          <div
            className="mb-5 flex items-start gap-3 px-4 py-3.5 rounded-xl border animate-scale-in"
            style={{ background: 'rgba(34,211,238,0.06)', borderColor: 'rgba(34,211,238,0.2)', color: '#0891b2' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0 mt-0.5">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
            <p className="text-sm">{message}</p>
          </div>
        )}

        {error && (
          <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-100 text-red-600 px-4 py-3.5 rounded-xl animate-scale-in">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0 mt-0.5">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="current" className="block text-xs font-600 text-slate-500 uppercase tracking-wider mb-2">
              Contraseña actual
            </label>
            <PasswordInput
              id="current"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <div className="pt-2 border-t border-pb-50 space-y-5">
            <div>
              <label htmlFor="new" className="block text-xs font-600 text-slate-500 uppercase tracking-wider mb-2">
                Nueva contraseña
              </label>
              <PasswordInput
                id="new"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
                minLength={8}
                showStrengthBar
              />
              <p className="mt-1.5 text-xs text-slate-400">Mínimo 8 caracteres, una mayúscula y un número.</p>
            </div>

            <div>
              <label htmlFor="confirm" className="block text-xs font-600 text-slate-500 uppercase tracking-wider mb-2">
                Confirmar contraseña
              </label>
              <PasswordInput
                id="confirm"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                hasError={!passwordsMatch}
              />
              {!passwordsMatch && (
                <p className="mt-1.5 text-xs text-red-500">Las contraseñas no coinciden.</p>
              )}
            </div>
          </div>

          <div className="pt-1">
            <button
              type="submit"
              disabled={loading || !passwordsMatch}
              className="w-full py-3 px-4 text-white text-sm font-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pb-400/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 active:scale-[0.99]"
              style={{
                background: 'linear-gradient(135deg, #1a2878 0%, #2b4ed4 100%)',
                boxShadow: '0 4px 14px rgba(32,53,168,0.3)',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Actualizando...
                </span>
              ) : 'Actualizar contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
