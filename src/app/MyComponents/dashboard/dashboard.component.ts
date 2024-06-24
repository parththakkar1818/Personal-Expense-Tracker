import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExpenseItem } from '../../ExpenseItem';
import { CommonModule } from '@angular/common';
import { AnalysisComponent } from '../analysis/analysis.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AnalysisComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  localItem: string | null = null;
  expenses: ExpenseItem[] = [];
  totalCost: number = 0;
  averageCost: number = 0;
  sortDirection: boolean = true;
  @Output() expensesUpdated: EventEmitter<ExpenseItem[]> = new EventEmitter();

  constructor(private router: Router) {
    this.localItem = this.getLocalStorageItem('Expenses');
    if (this.localItem === null || this.localItem.trim() === '') {
      this.expenses = [];
    } else {
      this.expenses = JSON.parse(this.localItem);
    }
    this.calculateTotalCost();
  }

  calculateTotalCost() {
    this.totalCost = this.expenses.reduce(
      (acc, current) => acc + current.cost,
      0
    );
    this.averageCost = (this.totalCost / this.expenses.length);
    this.averageCost.toFixed(2);
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

  deleteExpense(i: number) {
    console.log(i);
    this.expenses.splice(i, 1);
    this.setLocalStorageItem('Expenses', JSON.stringify(this.expenses));
    this.expensesUpdated.emit(this.expenses);
    this.calculateTotalCost();
  }
  editExpense(i: number) {
    const expense = this.expenses[i];
    this.router.navigate(['/additem'], {
      queryParams: {
        itemName: expense.itemName,
        description: expense.description,
        cost: expense.cost,
        categories: expense.categories,
        paymentVia: expense.paymentVia ? 'online' : 'offline',
        shopName: expense.shopDetails.shopName,
        shopAddress: expense.shopDetails.shopAddress,
        index: i,
      },
    });
  }

  sortExpensesByCost() {
    this.expenses = this.expenses.sort((a, b) => {
      if (this.sortDirection) {
        return a.cost - b.cost;
      } else {
        return b.cost - a.cost;
      }
    });
    this.sortDirection = !this.sortDirection;
  }
}
