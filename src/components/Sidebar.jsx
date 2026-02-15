import { NavLink } from 'react-router-dom';
import { Logo } from './Logo';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/settings', label: 'Settings' },
];

export function Sidebar({ subjects, open, onClose }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden animate-fade-in" onClick={onClose} aria-hidden />
      )}
      <aside className={`
        w-56 min-h-screen bg-dark-card border-r border-dark-border flex flex-col shrink-0 animate-fade-in
        fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-out
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
      <div className="p-4 border-b border-dark-border flex items-center justify-between gap-2 min-w-0">
        <Logo variant="full" className="min-w-0" />
        <button type="button" onClick={() => onClose?.()} className="lg:hidden p-1 text-dark-muted hover:text-dark-text shrink-0" aria-label="Close menu">×</button>
      </div>
      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-0.5">
          {navItems.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                onClick={() => onClose?.()}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive
                      ? 'bg-dark-accent/20 text-dark-accent font-medium'
                      : 'text-dark-muted hover:text-dark-text hover:bg-dark-border/50'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
        {subjects?.length > 0 && (
          <>
            <p className="px-3 py-2 text-xs font-medium text-dark-muted uppercase tracking-wider mt-4">
              Subjects
            </p>
            <ul className="space-y-0.5">
              {subjects.map((s) => (
                <li key={s.id}>
                  <NavLink
                    to={`/subject/${s.id}`}
                    onClick={() => onClose?.()}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-sm transition-colors truncate ${
                        isActive
                          ? 'bg-dark-accent/20 text-dark-accent font-medium'
                          : 'text-dark-muted hover:text-dark-text hover:bg-dark-border/50'
                      }`
                    }
                  >
                    {s.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </>
        )}
      </nav>
      </aside>
    </>
  );
}
