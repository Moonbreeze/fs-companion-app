import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Ресурсы', icon: '⚙' },
  { to: '/combat', label: 'Боёвка', icon: '⚔' },
  { to: '/reference', label: 'Справочник', icon: '📖' },
  { to: '/timer', label: 'Таймер', icon: '⏱' },
];

export default function Navigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-wh-panel border-t border-wh-border md:static md:border-t-0 md:border-r">
      <div className="flex md:flex-col">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1 py-3 px-2 text-xs transition-colors
              ${isActive
                ? 'text-wh-gold border-t-2 md:border-t-0 md:border-l-2 border-wh-gold bg-wh-gold/5'
                : 'text-gray-500 hover:text-gray-300 border-t-2 md:border-t-0 md:border-l-2 border-transparent'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-gothic tracking-wide">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
