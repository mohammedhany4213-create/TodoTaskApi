import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Sidebar } from '../components/common/Sidebar';
import { AddTaskModal } from '../components/tasks/AddTaskModal';
import { EditTaskModal } from '../components/tasks/EditTaskModal';
import { DeleteConfirmModal } from '../components/tasks/DeleteConfirmModal';

export const MainLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          <Outlet />
        </main>
      </div>

      {/* Global Task Modals */}
      <AddTaskModal />
      <EditTaskModal />
      <DeleteConfirmModal />

      {/* Bottom Status Bar - High Density Theme */}
      <footer className="h-8 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 px-6 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono shrink-0">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> All systems operational
          </span>
          <span className="hidden sm:inline">v2.4.0-SaaS</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-sans">
          <a href="#api" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">API Docs</a>
          <a href="#support" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Support</a>
        </div>
      </footer>
    </div>
  );
};
