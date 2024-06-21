import { Component, Input } from '@angular/core';
import { ExpenseItem } from '../../ExpenseItem';
import { CommonModule } from '@angular/common';
import { AnalysisComponent } from '../analysis/analysis.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AnalysisComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  
  localItem: string | null = null;
  expenses: ExpenseItem[] = [];

  constructor() {
    this.localItem = this.getLocalStorageItem('Expenses');
    if (this.localItem === null || this.localItem.trim() === '') {
      this.expenses = [];
    } else {
      this.expenses = JSON.parse(this.localItem);
    }
  }

  setLocalStorageItem(key: string, value: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  }
  getLocalStorageItem(key: string): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  }

  deleteExpense(i: number ){
    console.log(i);
    this.expenses.splice(i,1);
    this.setLocalStorageItem('Expenses', JSON.stringify(this.expenses));
  }

}
