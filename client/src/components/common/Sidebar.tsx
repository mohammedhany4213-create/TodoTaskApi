import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTasks } from '../../contexts/TaskContext';
import { LayoutDashboard, ListTodo, CheckCircle2, ChevronRight } from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { stats } = useTasks();

  const mainNav = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      to: '/tasks',
      label: 'All Tasks',
      icon: <ListTodo className="w-4 h-4" />,
      count: stats.totalTasks,
    },
    {
      to: '/tasks?status=completed',
      label: 'Completed',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
      count: stats.completedTasks,
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-16 bottom-0 left-0 z-30 w-64 bg-white/90 dark:bg-[#0B0F19]/90 border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col p-4 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6 overflow-y-auto pr-1">
          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Menu
            </p>
            <nav className="space-y-1">
              {mainNav.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {item.count}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between px-3 text-[11px] text-slate-500 dark:text-slate-400">
            <span>Task workspace</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </aside>
    </>
  );
};
