import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "../components/header/header";
import { User as User } from "../components/user/user";
import { Toasts } from "../components/toasts/toasts.component";

@Component({
  imports: [RouterOutlet, Header, User, Toasts],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'todo-list';
}
