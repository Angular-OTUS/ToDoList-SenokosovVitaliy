import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { map } from 'rxjs';
import { TodoService } from '../../services/todo.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-board',
  imports: [AsyncPipe],
  templateUrl: './board.html',
  styleUrl: './board.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Board {
  taskService = inject(TodoService);

  toDoTasks$ = this.taskService.tasks$.pipe(
    map((tasks) => tasks.filter((task) => task.status === 'ToDo')),
  );

  inProgressTasks$ = this.taskService.tasks$.pipe(
    map((tasks) => tasks.filter((task) => task.status === 'InProgress')),
  );

  doneTasks$ = this.taskService.tasks$.pipe(
    map((tasks) => tasks.filter((task) => task.status === 'Completed')),
  );
}
