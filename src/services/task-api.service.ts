import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskStatus } from '../components/todo-item/todo-item';

export type ServerTask = Omit<Task, 'isSelected'>;

@Injectable({
  providedIn: 'root',
})
export class TaskApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/tasks';

  getAll(): Observable<ServerTask[]> {
    return this.http.get<ServerTask[]>(this.baseUrl);
  }

  create(text: string, description: string): Observable<ServerTask> {
    return this.http.post<ServerTask>(this.baseUrl, {
      text,
      description,
      status: 'InProgress' as TaskStatus,
    });
  }

  update(id: number, changes: Partial<ServerTask>): Observable<ServerTask> {
    return this.http.patch<ServerTask>(`${this.baseUrl}/${id}`, changes);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
