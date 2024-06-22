import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FormComponent } from './MyComponents/form/form.component';
import { HomeComponent } from './MyComponents/home/home.component';
import { AnalysisComponent } from './MyComponents/analysis/analysis.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet, FormComponent, HomeComponent, AnalysisComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Personal-Expense-Tracker';
}
