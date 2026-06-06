import { useEffect, useState } from 'react';
import { getMe } from '../api/auth';
import type { User } from '../types';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getMemberDuration(iso: string): string {
  const months = Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24 * 30));
  if (months < 1) return 'menos de un mes';
  if (months === 1) return '1 mes';
  if (months < 12) return `${months} meses`;
  const years = Math.floor(months / 12);
  return years === 1 ? '1 año' : `${years} años`;
}

const IconEmail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const IconAt = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />
  </svg>
);

const IconCalendar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);

const IconHash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
  </svg>
);

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch(() => setError('No se pudo cargar el perfil'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <svg className="w-5 h-5 animate-spin text-pb-200" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="text-sm text-slate-400">Cargando perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-xl max-w-lg mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
        {error}
      </div>
    );
  }

  if (!user) return null;

  const fields = [
    { label: 'Correo electrónico', value: user.email,              Icon: IconEmail    },
    { label: 'Nombre de usuario',  value: `@${user.username}`,     Icon: IconAt       },
    { label: 'Miembro desde',      value: formatDate(user.createdAt), Icon: IconCalendar },
    { label: 'ID de usuario',      value: `#${user.id}`,           Icon: IconHash     },
  ];

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-700 text-pb-900 text-xl tracking-tight">Mi perfil</h1>
        <p className="text-sm text-slate-400 mt-1">Información de tu cuenta</p>
      </div>

      <div
        className="bg-white border border-pb-50 rounded-2xl overflow-hidden"
        style={{ boxShadow: '0 2px 8px rgba(7,9,31,0.07)' }}
      >
        {/* Banner */}
        <div
          className="h-28 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #07091f 0%, #0d1240 40%, #1a2878 100%)' }}
        >
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '22px 22px' }}
          />
          <div
            className="absolute -top-16 right-0 w-52 h-52 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.18) 0%, transparent 65%)' }}
          />
          <div
            className="absolute top-3 right-4 text-[11px] font-500 px-2.5 py-1 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.65)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            Miembro hace {getMemberDuration(user.createdAt)}
          </div>
        </div>

        <div className="px-6 pb-6">
          {/* Avatar + name */}
          <div className="flex flex-col items-center text-center -mt-12 mb-6 relative z-10">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-[88px] h-[88px] rounded-full object-cover bg-pb-50 ring-[3px] ring-white"
              style={{ boxShadow: '0 4px 16px rgba(7,9,31,0.15)' }}
              onError={e => {
                (e.target as HTMLImageElement).src =
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=88&background=c8d6fd&color=1a2878`;
              }}
            />
            <h2 className="font-display font-700 text-pb-900 text-xl mt-3 leading-tight">{user.name}</h2>
            <p className="text-sm text-slate-400 mt-0.5">@{user.username}</p>
          </div>

          {/* Info rows */}
          <dl className="space-y-px">
            {fields.map(({ label, value, Icon }) => (
              <div
                key={label}
                className="flex items-center justify-between py-3 px-3.5 rounded-xl gap-4 hover:bg-pb-50 transition-colors duration-100"
              >
                <dt className="flex items-center gap-2.5 shrink-0">
                  <span className="text-slate-300"><Icon /></span>
                  <span className="text-sm text-slate-400">{label}</span>
                </dt>
                <dd className="text-sm font-500 text-pb-800 text-right truncate">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
