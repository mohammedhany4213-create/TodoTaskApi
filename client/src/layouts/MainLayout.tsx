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
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          <Outlet />
        </main>
      </div>

      <AddTaskModal />
      <EditTaskModal />
      <DeleteConfirmModal />

      <footer className="h-8 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 px-6 flex items-center justify-center text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
        <span>TaskFlow</span>
      </footer>
    </div>
  );
};
