import api from './axios';
import { Task } from '../types';

export interface ApiTaskDto {
  id: number;
  title: string;
  description: string | null;
  isCompleted: boolean;
  createdAt: string;
  dueDate: string | null;
}

export interface PagedTasksResponse {
  items: ApiTaskDto[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  dueDate?: string | null;
}

export interface UpdateTaskRequest {
  title: string;
  description: string;
  isCompleted: boolean;
  dueDate?: string | null;
}

const formatDate = (value: string): string => value.split('T')[0];

export function mapApiTaskToTask(dto: ApiTaskDto): Task {
  const createdDate = formatDate(dto.createdAt);

  return {
    id: String(dto.id),
    title: dto.title,
    description: dto.description ?? '',
    dueDate: dto.dueDate ? formatDate(dto.dueDate) : '',
    status: dto.isCompleted ? 'completed' : 'todo',
    priority: 'medium',
    category: 'Work',
    createdAt: createdDate,
    updatedAt: createdDate,
    completedAt: dto.isCompleted ? createdDate : undefined,
  };
}

export async function getTasks(pageNumber = 1, pageSize = 20): Promise<PagedTasksResponse> {
  const response = await api.get<PagedTasksResponse>('/api/tasks', {
    params: { pageNumber, pageSize },
  });
  return response.data;
}

export async function getTaskById(id: string): Promise<Task> {
  const response = await api.get<ApiTaskDto>(`/api/tasks/${id}`);
  return mapApiTaskToTask(response.data);
}

export async function createTask(data: CreateTaskRequest): Promise<Task> {
  const response = await api.post<ApiTaskDto>('/api/tasks', data);
  return mapApiTaskToTask(response.data);
}

export async function updateTask(id: string, data: UpdateTaskRequest): Promise<void> {
  await api.put(`/api/tasks/${id}`, data);
}

export async function deleteTask(id: string): Promise<void> {
  await api.delete(`/api/tasks/${id}`);
}
