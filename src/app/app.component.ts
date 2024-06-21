import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FormComponent } from './MyComponents/form/form.component';
import { HomeComponent } from './MyComponents/home/home.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet, FormComponent, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Personal-Expense-Tracker';
}
