import apiClient from './client';
import type { Comment } from '../types';

export async function getFeed(): Promise<Comment[]> {
  const { data } = await apiClient.get<{ comments: Comment[] }>('/feed');
  return data.comments;
}

export async function createComment(content: string, parentId?: number): Promise<Comment> {
  const { data } = await apiClient.post<{ comment: Comment }>('/feed', { content, parentId });
  return data.comment;
}
