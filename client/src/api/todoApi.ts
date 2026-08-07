import api from './axios';
import { Task, TaskStatus } from '../types';

export interface ApiTaskDto {
  id: number;
  title: string;
  description?: string | null;
  isCompleted: boolean;
  createdAt: string;
  dueDate?: string | null;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  isCompleted?: boolean;
  createdAt: string;
  dueDate?: string | null;
}

export interface UpdateTaskRequest {
  title: string;
  description: string;
  isCompleted: boolean;
  dueDate?: string | null;
}

function formatDate(iso: string): string {
  return iso.split('T')[0];
}

export function mapApiTaskToTask(dto: ApiTaskDto): Task {
  const createdDate = formatDate(dto.createdAt);

  return {
    id: String(dto.id),
    title: dto.title,
    description: dto.description ?? '',
    dueDate: dto.dueDate ? formatDate(dto.dueDate) : createdDate,
    status: dto.isCompleted ? 'completed' : 'todo',
    priority: 'medium',
    category: 'Work',
    createdAt: createdDate,
    updatedAt: createdDate,
    completedAt: dto.isCompleted ? createdDate : undefined,
  };
}

export function mapTaskStatusToIsCompleted(status: TaskStatus): boolean {
  return status === 'completed';
}

export async function getTasks(): Promise<Task[]> {
  const response = await api.get<ApiTaskDto[]>('/api/todo');
  return response.data.map(mapApiTaskToTask);
}

export async function getTaskById(id: string): Promise<Task> {
  const response = await api.get<ApiTaskDto>(`/api/todo/${id}`);
  return mapApiTaskToTask(response.data);
}

export async function createTask(data: CreateTaskRequest): Promise<Task> {
  const response = await api.post<ApiTaskDto>('/api/todo', data);
  return mapApiTaskToTask(response.data);
}

export async function updateTask(id: string, data: UpdateTaskRequest): Promise<void> {
  await api.put(`/api/todo/${id}`, data);
}

export async function deleteTask(id: string): Promise<void> {
  await api.delete(`/api/todo/${id}`);
}
