import { NavLink, Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 p-4 border-r">
        <nav className="flex flex-col gap-2">
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/crews">Crews</NavLink>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <Outlet /> {/* <-- Bu olmazsa sayfalar görünmez */}
      </main>
    </div>
  );
}
