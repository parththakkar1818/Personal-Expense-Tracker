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
  cookiesItem: string | null = null;

  expenses: ExpenseItem[] = [];
  expensesLocalStorage: ExpenseItem[] = [];
  expensesCookies: ExpenseItem[] = [];
  
  totalCost: number = 0;
  averageCost: number = 0;
  sortDirection: boolean = true;
  @Output() expensesUpdated: EventEmitter<ExpenseItem[]> = new EventEmitter();

  constructor(private router: Router) {
    this.localItem = this.getLocalStorageItem('Expenses');
    this.cookiesItem = this.getCookieItem('Expenses');

    if (this.localItem !== null && this.localItem.trim() !== '') {
      this.expensesLocalStorage = JSON.parse(this.localItem);
    }
    else{
      console.log("nothing found in localstorage");
    }

    if (this.cookiesItem !== null && this.cookiesItem.trim() !== '') {
      this.expensesCookies = JSON.parse(this.cookiesItem);
    }
    else{
      console.log("nothing found in cookies");
    }

    // Merge expenses alternatively
    let maxLength = Math.max(
      this.expensesLocalStorage.length,
      this.expensesCookies.length
    );
    for (let i = 0; i < maxLength; i++) {
      if (i < this.expensesLocalStorage.length) {
        this.expenses.push(this.expensesLocalStorage[i]);
      }
      if (i < this.expensesCookies.length) {
        this.expenses.push(this.expensesCookies[i]);
      }
    }
    // console.log("from line 69: ",this.expenses);
    this.calculateTotalCost();
  }

  calculateTotalCost() {
    this.totalCost = this.expenses.reduce(
      (acc, current) => acc + current.cost,
      0
    );
    // this.averageCost = (this.totalCost / this.expenses.length);
    this.totalCost = parseFloat(this.totalCost.toFixed(2));
    this.averageCost = parseFloat((this.totalCost / this.expenses.length).toFixed(2));
    
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
  setCookieItem(key: string, value: string): void {
    if (typeof document !== 'undefined') {
      document.cookie = `${key}=${value}; path=/;`;
    }
  }

  getCookieItem(key: string): string | null {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split('; ');
      const cookie = cookies.find((cookie) => cookie.startsWith(`${key}=`));
      if (cookie) {
        // console.log('cookie value found..');
        // console.log(JSON.parse(cookie.split('=')[1]));
        return cookie.split('=')[1];
      }
    }
    console.log('no cookie found');
    return null;
  }


  deleteExpense(i: number) {
    console.log(i);
    this.expenses.splice(i, 1);
    console.log("want to delete: ",i);
    if(i%2==0){
      console.log("i came into localstorage delete");
      console.log("before expenselocal: ",this.expensesLocalStorage);
      this.expensesLocalStorage.splice((i/2),1);
      console.log("updated expenselocal: ",this.expensesLocalStorage);
      this.setLocalStorageItem('Expenses', JSON.stringify(this.expensesLocalStorage));
    }
    else{
      console.log("i came into delete from cookie");
      console.log("before expensecookie: ",this.expensesCookies);
      this.expensesCookies.splice(((i-1)/2),1);
      console.log("updated expensecookie: ",this.expensesCookies);

      this.setCookieItem('Expenses', JSON.stringify(this.expensesCookies));
      
    }
    // this.setLocalStorageItem('Expenses', JSON.stringify(this.expenses));
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
