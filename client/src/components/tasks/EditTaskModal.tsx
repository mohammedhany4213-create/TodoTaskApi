import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useTasks } from '../../contexts/TaskContext';
import { getApiErrorMessage } from '../../api/axios';
import { Calendar, Save } from 'lucide-react';

export const EditTaskModal: React.FC = () => {
  const { editingTask, setEditingTask, updateTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setDueDate(editingTask.dueDate);
      setIsCompleted(editingTask.status === 'completed');
      setError('');
    }
  }, [editingTask]);

  if (!editingTask) return null;

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
      await updateTask(editingTask.id, {
        title: cleanTitle,
        description: cleanDescription,
        isCompleted,
        dueDate: dueDate || null,
      });
      setEditingTask(null);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to update task'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={!!editingTask} onClose={() => setEditingTask(null)} title="Edit Task" subtitle="Update the task details and completion status." maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Task Title *" value={title} maxLength={100} onChange={(e) => { setTitle(e.target.value); if (error) setError(''); }} error={error} />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Description</label>
          <textarea rows={3} maxLength={500} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm p-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-xs" />
          <p className="text-right text-[11px] text-slate-400">{description.length}/500</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Status</label>
            <select value={isCompleted ? 'completed' : 'todo'} onChange={(e) => setIsCompleted(e.target.value === 'completed')} className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm py-2.5 px-3 focus:outline-none focus:border-indigo-500 cursor-pointer shadow-xs">
              <option value="todo">To Do</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <Input type="date" label="Due Date" leftIcon={<Calendar className="w-4 h-4" />} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>

        <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="ghost" onClick={() => setEditingTask(null)}>Cancel</Button>
          <Button type="submit" variant="primary" leftIcon={<Save className="w-4 h-4" />} isLoading={isSubmitting}>Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
};
