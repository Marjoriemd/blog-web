import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="max-w-4xl mx-auto px-5 py-8">
        <Outlet />
      </main>
    </div>
  );
}
