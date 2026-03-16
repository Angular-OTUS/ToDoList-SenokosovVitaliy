import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from "../components/header/header";
import { User as User } from "../components/user/user";
import { Toasts } from "../components/toasts/toasts.component";

@Component({
  imports: [RouterModule, Header, User, Toasts],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'todo-list';
}
