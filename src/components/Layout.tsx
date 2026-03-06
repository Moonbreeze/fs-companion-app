import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:block md:w-48 lg:w-56 shrink-0">
        <div className="fixed top-0 left-0 h-full w-48 lg:w-56 bg-wh-panel border-r border-wh-border">
          <div className="p-4 border-b border-wh-border">
            <h1 className="font-gothic text-wh-gold text-sm lg:text-base font-bold tracking-wider wh-glow leading-tight">
              Forbidden Stars
            </h1>
            <p className="text-[10px] text-gray-500 font-gothic tracking-widest uppercase mt-1">
              Companion
            </p>
          </div>
          <Navigation />
        </div>
      </div>

      <main className="flex-1 pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto p-4">
          <Outlet />
        </div>
      </main>

      <div className="md:hidden">
        <Navigation />
      </div>
    </div>
  );
}
