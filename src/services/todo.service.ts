import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task, TaskStatus } from '../components/todo-item/todo-item';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private tasksSubject = new BehaviorSubject<Task[]>([
    {
      id: 1,
      text: 'Learn Angular',
      isSelected: false,
      status: 'InProgress',
      description:
        'Study the official documentation and build sample projects.',
    },
    {
      id: 2,
      text: 'Build an app',
      isSelected: false,
      status: 'InProgress',
      description: 'Create a new Angular application using the CLI.',
    },
    {
      id: 3,
      text: 'Deploy to production',
      isSelected: false,
      status: 'InProgress',
      description: 'Deploy the application to a cloud provider.',
    },
  ]);

  tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  getTasks(): Task[] {
    return this.tasksSubject.value;
  }

  addTask(text: string, description: string): void {
    const value = text.trim();
    if (!value) return;

    const tasks = this.tasksSubject.value;
    const nextId = (tasks.at(-1)?.id ?? 0) + 1;
    this.tasksSubject.next([
      ...tasks,
      { id: nextId, text: value, description: description, isSelected: false, status: 'InProgress' },
    ]);
  }

  updateTask(id: number, text: string): void {
    const value = text.trim();
    if (!value) return;

    const tasks = this.tasksSubject.value;
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, text: value } : task,
    );
    this.tasksSubject.next(updatedTasks);
  }

  deleteTask(id: number): void {
    const tasks = this.tasksSubject.value;
    this.tasksSubject.next(tasks.filter((t) => t.id !== id));
  }

  updateTaskStatus(id: number, status: TaskStatus): void {
    const tasks = this.tasksSubject.value;
    this.tasksSubject.next(
      tasks.map((task) => (task.id === id ? { ...task, status } : task)),
    );
  }

  selectTask(taskId: number): void {
    const tasks = this.tasksSubject.value;
    const updatedTasks = tasks.map((task) => ({
      ...task,
      isSelected: task.id === taskId,
    }));
    this.tasksSubject.next(updatedTasks);
  }
}
