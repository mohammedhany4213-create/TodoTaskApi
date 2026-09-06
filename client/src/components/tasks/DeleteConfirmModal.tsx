import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useTasks } from '../../contexts/TaskContext';
import { getApiErrorMessage } from '../../api/axios';
import { AlertTriangle, Trash2 } from 'lucide-react';

export const DeleteConfirmModal: React.FC = () => {
  const { deletingTaskId, setDeletingTaskId, deleteTask, tasks } = useTasks();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const taskToDelete = tasks.find((task) => task.id === deletingTaskId);

  const handleDelete = async () => {
    if (!deletingTaskId) return;
    setIsDeleting(true);
    setError('');
    try {
      await deleteTask(deletingTaskId);
      setDeletingTaskId(null);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to delete task'));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={!!deletingTaskId} onClose={() => setDeletingTaskId(null)} maxWidth="sm">
      <div className="text-center py-2">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 flex items-center justify-center text-rose-600 dark:text-rose-400 mx-auto mb-4 shadow-xs">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Delete Task?</h3>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-2">
          Are you sure you want to delete <span className="font-semibold text-slate-800 dark:text-slate-200">"{taskToDelete?.title || 'this task'}"</span>? This action cannot be undone.
        </p>
        {error && <p className="mt-3 text-xs text-rose-500 font-medium">{error}</p>}
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button variant="ghost" size="md" onClick={() => setDeletingTaskId(null)}>Cancel</Button>
          <Button variant="danger" size="md" leftIcon={<Trash2 className="w-4 h-4" />} isLoading={isDeleting} onClick={handleDelete}>Delete</Button>
        </div>
      </div>
    </Modal>
  );
};
