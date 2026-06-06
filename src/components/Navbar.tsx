import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const IconHome = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[18px] h-[18px] shrink-0">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[18px] h-[18px] shrink-0">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const IconLock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[18px] h-[18px] shrink-0">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const IconLogout = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[18px] h-[18px] shrink-0">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
  </svg>
);

const navLinks = [
  { to: '/feed',            label: 'Feed',       Icon: IconHome },
  { to: '/me',              label: 'Perfil',     Icon: IconUser },
  { to: '/change-password', label: 'Contraseña', Icon: IconLock },
];

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav
      className="bg-white border-b border-pb-50 sticky top-0 z-20"
      style={{ boxShadow: '0 1px 3px rgba(7,9,31,0.06)' }}
    >
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/feed" className="flex items-center gap-2.5 select-none group">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #131c5c 0%, #2b4ed4 100%)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
              <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
            </svg>
          </div>
          <span className="font-display font-700 text-pb-900 text-[15px] tracking-tight hidden sm:block">Blog</span>
        </Link>

        <div className="flex items-center gap-1">
          {navLinks.map(({ to, label, Icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-500 transition-all duration-150 ${
                  isActive
                    ? 'bg-pb-900 text-white'
                    : 'text-slate-500 hover:text-pb-800 hover:bg-pb-50'
                }`}
              >
                <Icon />
                <span className="hidden sm:block">{label}</span>
              </Link>
            );
          })}

          <div className="h-5 w-px bg-slate-200 mx-1" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-500 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all duration-150"
          >
            <IconLogout />
            <span className="hidden sm:block">Salir</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
