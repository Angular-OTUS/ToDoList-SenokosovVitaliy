import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TodoList } from "../components/todo-list/todo-list";
import { Header } from "../components/header/header";

@Component({
  imports: [RouterModule, TodoList, Header],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'todo-list';
}
