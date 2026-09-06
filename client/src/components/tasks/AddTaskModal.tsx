import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useTasks } from '../../contexts/TaskContext';
import { getApiErrorMessage } from '../../api/axios';
import { Calendar, Plus } from 'lucide-react';

const getDefaultDueDate = () => new Date(Date.now() + 86400000).toISOString().split('T')[0];

export const AddTaskModal: React.FC = () => {
  const { isAddModalOpen, setIsAddModalOpen, addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(getDefaultDueDate());
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
      await addTask({
        title: cleanTitle,
        description: cleanDescription,
        dueDate: dueDate || null,
      });
      setTitle('');
      setDescription('');
      setDueDate(getDefaultDueDate());
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

        <Input type="date" label="Due Date" leftIcon={<Calendar className="w-4 h-4" />} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />

        <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="ghost" onClick={close}>Cancel</Button>
          <Button type="submit" variant="primary" leftIcon={<Plus className="w-4 h-4" />} isLoading={isSubmitting}>Create Task</Button>
        </div>
      </form>
    </Modal>
  );
};
