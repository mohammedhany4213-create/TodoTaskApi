import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useTasks } from '../../contexts/TaskContext';
import { TaskPriority, TaskCategory } from '../../types';
import { getApiErrorMessage } from '../../api/axios';
import { Calendar, Plus } from 'lucide-react';

export const AddTaskModal: React.FC = () => {
  const { isAddModalOpen, setIsAddModalOpen, addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [category, setCategory] = useState<TaskCategory>('Work');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const close = () => {
    if (!isSubmitting) {
      setIsAddModalOpen(false);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    if (!cleanTitle) return setError('Task title is required');
    if (cleanTitle.length > 100) return setError('Task title must be 100 characters or less');
    if (cleanDescription.length > 500) return setError('Description must be 500 characters or less');

    setIsSubmitting(true);
    setError('');

    try {
      await addTask({ title: cleanTitle, description: cleanDescription, dueDate, priority, category, status: 'todo' });
      setTitle('');
      setDescription('');
      setDueDate(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
      setPriority('medium');
      setCategory('Work');
      setIsAddModalOpen(false);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to create task'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isAddModalOpen} onClose={close} title="Create New Task" subtitle="Add a task to your personal workspace." maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Task Title *" placeholder="e.g. Finish API security review" value={title} maxLength={100} onChange={(e) => { setTitle(e.target.value); if (error) setError(''); }} error={error} autoFocus />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Description</label>
          <textarea rows={3} maxLength={500} placeholder="Add notes about this task..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm p-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-xs" />
          <p className="text-right text-[11px] text-slate-400">{description.length}/500</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input type="date" label="Due Date" leftIcon={<Calendar className="w-4 h-4" />} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)} className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm py-2.5 px-3 focus:outline-none focus:border-indigo-500 cursor-pointer shadow-xs">
              <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as TaskCategory)} className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm py-2.5 px-3 focus:outline-none focus:border-indigo-500 cursor-pointer shadow-xs">
              <option value="Engineering">Engineering</option><option value="Design">Design</option><option value="Work">Work</option><option value="Marketing">Marketing</option><option value="Personal">Personal</option>
            </select>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="ghost" onClick={close}>Cancel</Button>
          <Button type="submit" variant="primary" leftIcon={<Plus className="w-4 h-4" />} isLoading={isSubmitting}>Create Task</Button>
        </div>
      </form>
    </Modal>
  );
};
