import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TodoList } from "../components/todo-list/todo-list";

@Component({
  imports: [RouterModule, TodoList],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'todo-list';
}
